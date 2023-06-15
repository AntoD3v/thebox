

const pushNotification = ({type = "info", text="il faut te config !", timeout = 3000}) => {

    let container = document.querySelector(".notification_container");

    if(container === null) {

        container = document.createElement("div")
        container.className = "notification_container"
        document.body.appendChild(container);

    }

    let element = document.createElement("div");
    element.innerText = text;

    setTimeout(() => {

        element.classList.add("close");
        setTimeout(() => element.remove(), 1000);

    }, timeout)

    container.appendChild(element);

    element.classList.add("open");
    element.classList.add(type);

}