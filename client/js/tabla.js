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
            .icons{
                display: flex;
                width: 50%;
            }

            .editar{
                width: 50%;
                margin: auto;
            }

            svg{
                font-size: 0.5rem;
                width: 2rem;
                cursor: pointer;
            }
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
              
                row.appendChild(info);
            });

            let info = document.createElement('div');
            info.setAttribute('class', 'informacion');

            let icons = document.createElement('div');
            icons.classList.add('icons');
            
            let iconEditar = document.createElement('div');
            iconEditar.classList.add('editar');
            iconEditar.dataset.id = registers.id;
          
            iconEditar.innerHTML = `
              <svg viewBox="0 0 24 24">
                  <title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
              </svg>
            `;

            let iconEliminar = document.createElement('div');
            iconEliminar.classList.add('eliminar');
          
            iconEliminar.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                </svg>
            `;

            iconEliminar.dataset.id = registers.id;

            icons.appendChild(iconEditar);
            icons.appendChild(iconEliminar);

            info.appendChild(icons);
            row.appendChild(info);
              
            values.appendChild(row);

            iconEditar.addEventListener('click',(e) =>{

                document.dispatchEvent(new CustomEvent("showElement", {
                    detail: {
                        id: iconEditar.dataset.id
                    }
                }));
            });

            iconEliminar.addEventListener('click',(e) =>{

                document.dispatchEvent(new CustomEvent("showDeleteModal", {
                    detail: {
                        id: iconEliminar.dataset.id
                    }
                }));
            });

            
        });
    }

    renderDeleteTable = () => {

        let deleteButton = this.shadow.querySelector('.eliminar');

        deleteButton.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('delete', {
                detail: { deleteButton: deleteButton.id }
            }));
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
