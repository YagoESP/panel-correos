class Title extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.title = this.getAttribute('title');
    }
    

    static get observedAttributes() { return ['title']; }

    connectedCallback() {
    
        document.addEventListener("newUrl",( event =>{
            this.setAttribute('title', event.detail.title);
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
            h1 {
                font-family: 'Roboto', sans-serif;
                font-size: 2rem;
                font-weight: 600;
                color: #fff;
                text-align: center;
            }
        </style>
        `;

        

        const title = document.createElement('h1');
        title.textContent = this.title;

       
        this.shadow.appendChild(title);
    }
}

customElements.define('title-component', Title);
