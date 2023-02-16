import { API_URL } from '../config/config.js';

class Tabla  extends HTMLElement {
    
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.url =  this.getAttribute('url');
        this.data = [];
    }    

    static get observedAttributes() { return ['url']; }

    connectedCallback(){
        document.addEventListener("newUrl",( event =>{
            this.setAttribute('url',event.detail.url);
        }));

    
    }

    attributeChangedCallback(name, oldValue, newValue){
        this.loadData().then(() => this.render());
        
    }   

    async loadData() {

        let url = `${API_URL}${this.getAttribute("url")}`;

        try{

            let response = await fetch(url, { 
                headers: {
                    'x-access-token': sessionStorage.getItem('accessToken'),
                }
            });
    
            let data = await response.json();
            this.data =  data;

        }catch(error){
            console.log(error);
        }
    }

    render() {
       
        this.shadow.innerHTML =
                `
        <style>
            .correo-informacion{
                width:90%;
                display:flex;
                justify-content: space-between;
                margin: auto;
                background: black;
                border: 1px solid black;
            }
            
            .box{
                display:flex;
             
            }

            .correo-informacion h2{
                padding-left: 1rem; 
                color: white;
            }  
            
            .informacion{
                width:90%;
                margin:auto;
                display:flex;
                padding: 1rem;
            }

            .informacion p{
                
                display:flex;
            }

            .headers{
                display: flex;
            
            }

            .row{
                display: flex;
                background: white;
                border: 1px solid black;
            }

        </style>
        `;      

        let tableStructure = this.setTableStructure();
        let headers = document.createElement("div");
        let values = document.createElement("div");
        headers.classList.add("headers");
        values.classList.add("values");
        this.shadow.append(headers);
        this.shadow.append(values);
        
        Object.keys(tableStructure.headers).forEach(Keys => {

            let key = tableStructure.headers[Keys].label;

            let header = document.createElement('div');
            header.setAttribute('class', 'correo-informacion');

            let div = document.createElement('div');
            div.setAttribute('class','box');

            let h2 = document.createElement('h2');
            h2.textContent = key;

            header.appendChild(div);

            div.appendChild(h2);

            headers.appendChild(header);
        });

        this.data.forEach(registers =>{

            let row = document.createElement("div");
            row.classList.add("row");

            Object.keys(tableStructure.headers).forEach(value => {

                let info = document.createElement('div');
                info.setAttribute('class', 'informacion');

                let p = document.createElement('p');
                p.textContent = registers[value];

                info.appendChild(p);
                
                console.log(registers[value]);

                row.appendChild(info);
                
            });

            values.append(row)
        });
    }     

    setTableStructure() {

        let url = this.getAttribute('url');

        switch (url) {


            case '/api/admin/customers':

                return {

                    filters: {
                        name: {
                            label: 'Nombre',
                        },
                        surname: {
                            label: 'Apellidos',
                        },
                        email: {
                            label: 'Email',
                        }
                    },
                    headers:{
                        email: {
                            label: 'Email',
                        },
                        name: {
                            label: 'Nombre',
                        },
                        surname: {
                            label: 'Apellidos',
                        },
                    },
                    buttons: {
                        edit: true,
                        remove: true
                    }
                };

            case '/api/admin/emails':

                return {

                    filters: {
                        subject: {
                            label: 'Asunto',
                        }
                    },
                    headers:{
                        subject: {
                            label: 'Asunto',
                        },
                        content: {
                            label: 'Contenido',
                        }
                    },
                    buttons: {
                        edit: true,
                        remove: true
                    }
                };

            case '/api/admin/users':
                return {

                    filters: {
                        user: {
                            label: 'Usuario',
                        }
                    },
                    headers:{
                        name: {
                            label: 'Nombre',
                        },
                        email: {
                            label: 'Email',
                        }
                    },
                    buttons: {
                        edit: true,
                        remove: true
                    }
                };
        }
    }
}
        
customElements.define('tabla-component', Tabla);
