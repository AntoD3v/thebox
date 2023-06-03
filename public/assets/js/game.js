var socket = io.connect('http://localhost:80');

const elementStatus = document.getElementById("status");
const elementSetupSelect = document.getElementById("setup_select");
const inputUsername = document.getElementsByName("username").item(0);
const inputContact = document.getElementsByName("contact").item(0);
const elementUpdateTime = document.querySelector(".game h1");

inputUsername.onkeyup = (e) => {

    if(inputUsername.value.length > 3) {

        socket.emit("user_available", inputUsername.value)

    } else {
        set_available_user(false)
    }

    if(event.key === "Enter") {

        if(inputUsername.value.length < 3) {

            pushNotification({type: "error", text: "Ton nom est trop court"})
            return;

        }

        if(!user_available) {

            pushNotification({type: "error", text: "Le nom n'est pas disponible. Si vous voulez refaire une session, contactez le staff"})
            return;

        }

        socket.lastUsername = inputUsername.value
        document.querySelectorAll("b").forEach(item => item.innerText = socket.lastUsername)
        show_section("contact")

        inputUsername.value = ""

    }

}

inputContact.onkeyup = (e) => {

    if(event.key === "Enter") {

        socket.lastContact = inputContact.value;
        this.socket.emit("register", {
            username: socket.lastUsername,
            contact: socket.lastContact
        })

        inputContact.value = ""

    }

}

let alreadyConnected = false
window.onload = () => {

    socket.on('connect', () => {

        if(alreadyConnected) {

            window.location.reload();
            return;

        }

        alreadyConnected = true;

        elementStatus.innerHTML = '<span class="online">ONLINE</span>'

        socket.emit("request_list_ports_com")

        socket.on("request_list_ports_com", (data) => {
            elementSetupSelect.innerHTML = elementSetupSelect.childNodes.item(0);
            data.forEach(item => {
                let option = document.createElement("option");
                option.value = item.com;
                option.innerText = item.name;
                elementSetupSelect.appendChild(option);
            })
            console.log("data:", data)
        })

        socket.on("request_port_com", (result) => {

            if(result.success) {

                socket.com = result.com;
                elementSetupSelect.innerHTML = elementSetupSelect.childNodes.item(0);
                elementStatus.innerHTML = '<span class="online">' + socket.com + '</span>'

                show_section("username");

            }else {

                pushNotification({type: "error", text: "Une erreur s'est produite lors de l'attribution du port " + result.com})
                console.log(result.message)

            }

        })

        socket.on("user_available", (b) => set_available_user(b))

        socket.on("prestart", () => show_section("waiting"));
        socket.on("start", () => show_section("game"));

        socket.on("end", () => {

            socket.emit("score_and_destroy")

        })

        socket.on("score", (data) => {

            show_section("result")

            update_score_boxes(data.boxes);

            let score = document.getElementById("score");
            score.innerHTML = format_time_msm(data.boxes.reduce((a,b) => a+b)) + "<br><span>Position #" + data.position + " • " + data.boxes.length + " boîte(s) ouverte(s)</span>";

        })

        socket.on("game_update", (data) => {

            elementUpdateTime.innerHTML = format_time_msm(data.time) + "<br><span>/ " + format_time_ms(data.max) + "</span>"

        });


    })

    socket.on("box_update", (boxes) => update_boxes(boxes))

    socket.on("reset", () => reset())

    socket.on("disconnect", () => {
        pushNotification({type: "error", text: "Vous êtes déconnecté !", timeout: 10000})
        elementStatus.innerHTML = '<span class="">OFFLINE</span>'
    })

}

const show_section = (name) => {

    document
        .querySelectorAll("section")
        .forEach(item => item.style.display = item.classList.contains(name) ? "flex" : "none")

}

const set_port_com = () => socket.emit("request_port_com", elementSetupSelect.value);

let user_available = false;
const set_available_user = (b) => {
    user_available = b;
    document.getElementById("user_available").className = b ? "gg-check" : "gg-close"
};

const start_challenge = () => socket.emit("start");

const reset = () => {

    socket.lastContact = ""
    socket.lastUsername = ""
    show_section("username");
    update_boxes([])
    set_available_user(false);

}

const update_boxes = (boxes) => {

    let items = document.querySelectorAll("#game_boxes div");

    for(var i = 0; i < 4; i++) {

        let item = items.item(i)

        let img = item.childNodes.item(1);
        let span = item.childNodes.item(3);

        if(i < boxes.length) {

            img.src = "assets/image/box_opened.svg";
            span.innerHTML = format_time_msm(boxes[i]);

        }else{

            img.src = "assets/image/box.svg";
            span.innerHTML = "-"

        }


    }

}

const update_score_boxes = (boxes) => {

    let items = document.querySelectorAll("#score_boxes div");

    for(var i = 0; i < 4; i++) {

        let item = items.item(i)

        let img = item.childNodes.item(1);
        let span = item.childNodes.item(3);

        if(i < boxes.length) {

            img.src = "assets/image/box_opened.svg";
            span.innerHTML = format_time_msm(boxes[i]);

        }else{

            img.src = "assets/image/box_failed.svg";
            span.innerHTML = "-"

        }


    }

}