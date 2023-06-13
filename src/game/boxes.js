const serialport = require("../serial/index")
const storage = require("../storage/database.js")
const {REGISTRATION, IN_GAME, END, WAITING} = require("./state");
const {get_leaderboard} = require("./leaderboard");
const SerialPort = require("serialport");

const MAX_TIME = 300000;

class Boxes {

    state;
    opened = 0;
    time = null;
    timer = null;

    constructor(socket, serial) {

        this.socket = socket;
        this.serial = serial;

        serial.on("close", () => this.socket.disconnect())
        serialport.on(this.serial, "@start", () => this.start());
        serialport.on(this.serial, "@press", () => this.press());

        let self = this;
        this.socket.on("register", (data) => self.register.call(self, data))
        this.socket.on("start", () => self.start.call(self))
        this.socket.on("reset", () => self.reset.call(self))
        this.socket.on("score_and_destroy", () => self.score_and_destroy.call(self))

        this.reset();

    }

    start() {

        if(this.state !== WAITING) {

            this.socket.emit("push_notification", {type: "error", text: "Le jeu est déja démarré"});

            return;

        }

        this.state = IN_GAME;

        this.timer = setInterval(() => this.tick(), 10)
        this.time = Date.now();
        this.socket.emit("start");

    }

    tick() {

        let interval = Date.now() - this.time;

        if(interval >= MAX_TIME) {

            this.socket.emit("end");

            clearTimeout(this.timer);

            this.state = END;

            return;

        }

        this.socket.emit("game_update", {
            time: interval,
            max: MAX_TIME,
        });

    }

    register({username, contact}) {

        if(this.state !== REGISTRATION) {

            this.socket.emit("push_notification", {type: "error", text: "Vous ne pouvez pas vous enregistrez en jeu"});
            return;

        }

        this.username = username;
        this.contact = contact;

        storage.user_available(username, (b) => {

            if(!b) {

                this.socket.emit("push_notification", {type: "error", text: "Nom d'utilisateur invalide"});
                return;

            }

            storage.add(username, contact, (err) => {

                if(err !== null) {

                    console.log(err)
                    this.socket.emit("push_notification", {type: "error", text: "Erreur interne :c"});
                    return;

                }

                this.socket.emit("prestart");

                this.state = WAITING;

            });

        })

    }

    reset() {

        this.serial.write("@reset");
        this.username = "";
        this.contact = "";
        this.socket.emit("reset");
        clearTimeout(this.timer);
        this.time = 0;
        this.state = REGISTRATION;
        this.box = [];


    }

    press() {

        if(this.state !== IN_GAME) {

            this.socket.emit("push_notification", {type: "error", text: "Les boutons sont pressés mais le jeu n'est pas en route"});
            return;

        }

        if(this.box.length > 4) {

            this.socket.emit("push_notification", {type: "error", text: "Erreur interne (bouton)"});
            return;

        }

        let snapshot = Date.now() - this.time;

        this.box.push(snapshot)

        storage.update_user_box(this.username, this.box.length, snapshot);

        this.socket.emit("box_update", this.box);

        if(this.box.length >= 4) {

            clearInterval(this.timer);

            this.state = END;

            let self = this;
            setTimeout(() => {

                self.socket.emit("end");

            }, 3000)

        }

    }

    score_and_destroy() {

        get_leaderboard((lb) => {

            this.socket.broadcast.emit("leaderboard", lb)

            this.socket.emit("score", {

                boxes: this.box,
                position: lb.filter(e => e.username === this.username)[0].position

            });

        });

        setTimeout(() => {

            if(this.state === END) this.reset()

        }, 20000)

    }

}

module.exports = {Boxes}