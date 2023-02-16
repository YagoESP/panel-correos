import { API_URL } from '../config/config.js';

class Menu extends HTMLElement {
    
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.menuItems = [];
    
    }    
    
    connectedCallback(){
        this.loadData().then(() => this.render());
    }

    async loadData() {

        let url = `${API_URL}/api/admin/menus/display/${this.getAttribute("menu")}`;

        try{

            let response = await fetch(url, { 
                headers: {
                    'x-access-token': sessionStorage.getItem('accessToken'),
                }
            });
    
            let data = await response.json();
            this.menuItems =  data.menuItems;
            
        }catch(error){
            console.log(error);
        }
    }

    render() {
        
        this.shadow.innerHTML =
                `
        <style>
            .menu{
                display:flex;
                text-align:center;
            }
            
            a{
                width:100%;
                text-decoration:none;
                cursor:pointer;
                font-size: 1.6rem;
                border:solid 1px black;
                padding: 1rem;
                color: black;
            }
        </style>

        `;     

        let itemContainer = document.createElement('div');
        itemContainer.classList.add('menu');

        
        this.menuItems.forEach(menuItem => {

            let item = document.createElement('a');
            item.textContent = menuItem.name;
            item.href= menuItem.customUrl;

            itemContainer.appendChild(item);
            this.shadow.appendChild(itemContainer);
            
            item.addEventListener("click", event =>{

                event.preventDefault();

                document.dispatchEvent(new CustomEvent('newUrl', {
                    detail: {
                        title:  item.textContent,
                        url: item.getAttribute("href")
                    }
                }));
            })
        });

       
    }        
}
        
customElements.define('menu-component', Menu);
