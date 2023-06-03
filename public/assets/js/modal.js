class Modal {

    constructor(url, {onClose}){
        this.url = url;
        this.onClose = onClose;
    }

    get() {

        let request = new XMLHttpRequest();
        request.open( "GET", this.url, false );
        request.send( null );

        return request.responseText;

    }

    build() {

        const modalContainer = document.createElement("div");
        modalContainer.className = "modal_container"

        modalContainer.onclick = (e) => {

            if(e.target === modalContainer) {

                if(!this.onClose()) {

                    modalContainer.remove();

                }

            }

        }

        document.body.appendChild(modalContainer);

        const modal = document.createElement("modal");

        modalContainer.appendChild(modal);

        modal.innerHTML = this.get();

    }

}

const closeModal = () => {

    const modalContainer = document.querySelector(".modal_container");

    if(modalContainer != null) {

        modalContainer.remove()

    }
}

const show = (url = "", {onClose} = {onClose: () => false}) => {

    closeModal();

    let modal = new Modal(url, {onClose: onClose});
    modal.build();

}