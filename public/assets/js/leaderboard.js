var socket = io.connect('http://localhost:80');

let second = document.getElementById("leaderboard_second");
let podiums = document.getElementById("podiums");

window.onload = () => {

    socket.on('connect', () => {

        socket.on("leaderboard", (lb) => {

            fillBoard(lb);

        });

        socket.emit("get_leaderboard")

    });



}


const fillBoard = (leaderboard) => {

    second.innerHTML = ""
    podiums.innerHTML = ""

    for (let i = 0; i < leaderboard.length; i++){

        let person = leaderboard[i];

        let element = create_leaderboard_item(person.position, person.username, person.total, person.open)

        second.appendChild(element);

        if(i < 9) {

            let podium = create_podium_item(person.username, person.total, person.open)

            podiums.appendChild(podium)

        }

    }

    document.querySelector(".stats").innerText = leaderboard.length + " participants"

}


const create_leaderboard_item = (position, name, time, open) => {

    let item = document.createElement("li");
    item.innerHTML = `<span>` + position + `</span><div><p>` + name + `</p><p>` + open + ` boîte(s) ouverte(s) en ` + format_time_msm(time) + `</p></div>`

    return item;

}

const create_podium_item = (name, time, open) => {

    let item = document.createElement("div");
    item.className = "podium"

    let itemName = document.createElement("div");
    itemName.innerText = name;
    item.appendChild(itemName);

    while(itemName.clientWidth > 40) {
        itemName.style.fontSize = (parseFloat(window.getComputedStyle(itemName).fontSize) - 1) + "px"
    }


    let itemDesc = document.createElement("span");
    itemDesc.innerText = open + " Boîte(s) en " + format_time(time)
    item.appendChild(itemDesc);

    return item;

}


let container = document.getElementById("leaderboard_second");

let pause = 0;
let interval = 20;
setInterval(() => {

    container.scroll({behavior:"auto", top: (container.scrollTop + 1) % (container.scrollHeight - container.clientHeight)})

    let first = container.firstElementChild;
    if(first == null) return;

    if(container.scrollTop > first.clientHeight + 10) {

        container.removeChild(first);
        container.appendChild(first);

        container.scroll({behavior:"auto", top: 0})

    }

}, interval)
