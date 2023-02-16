class Notificacion extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.render();
    }

    connectedCallback() {
    
        document.addEventListener("save",( event =>{
            let storeButtonId = event.detail.storeButton;
            let storeButton = document.getElementById(storeButtonId);
            if (storeButton) {
                storeButton.addEventListener('click', () => {
                  let notificationSave = this.shadow.querySelector('.notification-save');
                  notificationSave.classList.add('active-save');
                });
                
            }
        }));
        

        document.addEventListener("delete",( event =>{
            let deleteButtonId = event.detail.deleteButton;
            let deleteButton = document.getElementById(deleteButtonId);
            if (deleteButton) {
                deleteButton.addEventListener('click', () => {
                  let notificationDelete = this.shadow.querySelector('.notification-delete');
                  notificationDelete.classList.add('active-delete');
                });
            }
        }));

        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue){
        this.render();
    }   
    
    render() {
        this.shadow.innerHTML =
        `
        <style>
           
            .notification-save {
                display: none;
                
            }

            .notification-delete {
                display: none;
                
            }

            .active-save{
                display: flex;
                height: 100%;
                justify-content: center;
                align-items: center;
            }

            .active-delete{
                display: flex;
                height: 100%;
                justify-content: center;
                align-items: center;
            }

            .message-save {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                positon: relative;
                width: 50px;
                height: 50px;
                background: green;
                transform: scale(0);
                border-radius: 50%;
                color: white;
                opacity: 0;
                overflow: hidden;
                animation: scale-in .3s ease-out forwards,
                    expand .35s .25s ease-out forwards;
            }

            .message-delete {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                positon: relative;
                width: 50px;
                height: 50px;
                background: red;
                transform: scale(0);
                border-radius: 50%;
                color: white;
                opacity: 0;
                overflow: hidden;
                animation: scale-in .3s ease-out forwards,
                    expand .35s .25s ease-out forwards;
            }

            .notification-text {
                display: flex;
                align-items: center;
                padding: 0 16px;
                font-family: 'Roboto', sans-serif;
                font-size: 14px;
                animation: fade-in .65s ease-in forwards;
            }

            @keyframes scale-in {
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            @keyframes expand {
                50% {
                    width: 350px;
                    border-radius: 6px;
                }
                100% {
                    width: 300px;
                    border-radius: 4px;
                    box-shadow: 0px 1px 3px 0px rgba(0,0,0,.2),
                                            0px 1px 1px 0px rgba(0,0,0,.14),
                                            0px 3px 3px -1px rgba(0,0,0,.12);
                }
            }

            @keyframes fade-in {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: .8;
                }
            }
        </style>

        <div class="notification-save">
            <div class="message-save">
                <div class="notification-text">
                    <span>Tu elemento se ha guardado </span>
                </div>
            </div>
        </div>

        <div class="notification-delete">
            <div class="message-delete">
                <div class="notification-text">
                    <span>Tu elemento se ha guardado </span>
                </div>
            </div>
        </div>

        `;

     

        

        
    }
}

customElements.define('notificacion-component', Notificacion);
