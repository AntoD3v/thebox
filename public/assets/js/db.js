var socket = io.connect('http://localhost:80');

const elementStatus = document.getElementById("status");
const elementTable = document.getElementsByTagName("table").item(0);

let alreadyConnected = false
window.onload = () => {

    socket.on('connect', () => {

        if (alreadyConnected) {

            window.location.reload();
            return;

        }

        alreadyConnected = true;

        elementStatus.innerHTML = '<span class="online">ONLINE</span>'

        socket.emit("db_get");

        socket.on("db_get", (users) => {

            elementTable.innerHTML = "";

            users.forEach(user => {

                let tr = document.createElement("tr");

                for(let key in user) {

                    let td = document.createElement("td");
                    td.innerText = user[key];
                    tr.appendChild(td);

                }

                elementTable.appendChild(tr);

            })
            console.log(users)
        })

    });
};