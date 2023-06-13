const storage = require("./storage/database.js")
const server = require("./server.js")
const {Boxes} = require("./game/boxes.js")
const serialport = require("./serial");
const {get_leaderboard } = require("./game/leaderboard")

console.log("Lockpicking Software 2023")

server.on(socket => {

    console.log(" + client")

    socket.on("request_port_com", (com) => {


            let serial = serialport.createSerial(com, (err) => {

                if(!err) {

                    let boxes = new Boxes(socket, serial)

                    socket.emit("request_port_com", {
                        success: true,
                        com: com,
                    });

                }else{

                    socket.emit("request_port_com", {
                        success: false,
                        com: com,
                        message: err.message
                    });

                }

            });

            socket.serial = serial;


    })

    socket.on("user_available", (username) => storage.user_available(username, (b) => socket.emit("user_available", b)));

    socket.on("get_leaderboard", () => {

        get_leaderboard((lb) => {

            socket.emit("leaderboard", lb)

        });

    })

    socket.on("disconnect", () => {

        console.log(" - client")
        try {

            if(socket.serial) socket.serial.close((e) => console.log("error durant la fermeture"));

        }catch (e) {}

    });

});
