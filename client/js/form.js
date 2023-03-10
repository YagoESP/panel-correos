import { API_URL } from '../config/config.js';

class FormBuilder extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.formStructure = this.setFormStructure();
    }

    static get observedAttributes() { return ['url']; }

    connectedCallback() {

        document.addEventListener("newUrl",( event =>{
            this.setAttribute('url', event.detail.url);
        }));

        document.addEventListener("showElement", async (event) => {

            this.id = event.detail.id;

            this.showElement(event.detail.id)
                
        });
      
        document.addEventListener("showDeleteModal", (event => {

            this.id = event.detail.id;

            this.showDeleteModal(event.detail.id)

            

        }));
    }

    async attributeChangedCallback(name, oldValue, newValue){
        this.formStructure = await this.setFormStructure();        
        await this.render();
    }

    render = async () => {

        this.shadow.innerHTML = 
        `
        <style>

            .tabs-container-menu{
                background-color: hsl(100, 100%, 100%);
                display: flex;
                height: 2.5em;
                justify-content: space-between;
                width: 100%;
            }
            
            .tabs-container-menu ul{
                height: 2.5em;
                display: flex;
                margin: 0;
                padding: 0;
            }
            
            .tabs-container-menu li{
                color: hsl(0, 0%, 50%);
                cursor: pointer;
                font-family: 'Roboto' , sans-serif;
                list-style: none;
                font-weight: 600;
                padding: 0.5em;
                text-align: center;
            }
            
            .tabs-container-menu li.active,
            .tabs-container-menu li.active:hover{
                background-color:hsl(207, 85%, 69%);
                color: white;
            }
            
            .tabs-container-buttons{
                display: flex;
                padding: 0 0.5em;
            }

            .tabs-container-buttons svg{
                cursor: pointer;
                height: 2.5rem;
                width: 2.5rem;
                fill: hsl(207, 85%, 69%);
            }

            .tabs-container-buttons svg:hover{
                fill: hsl(19, 100%, 50%);
            }

            .errors-container{
                background-color: hsl(0, 0%, 100%);
                display: none;
                flex-direction: column;
                gap: 1em;
                margin-top: 1em;
                padding: 1em;
            }

            .errors-container.active{
                display: flex;
            }

            .errors-container .error-container{
                width: 100%;
            }

            .errors-container .error-container span{
                color: hsl(0, 0%, 50%);
                font-family: 'Roboto' , sans-serif;
                font-size: 1em;
                font-weight: 600;
            }
            
            .tab-panel{
                display: none;
            }
            
            .tab-panel.active{
                display: block;
                padding: 1em 0;
            }
            
            .row {
                display: flex;
                justify-content: space-between;
                gap: 2em;
            }

            .form-element{
                margin-bottom: 1em;
                width: 100%;
            }
            
            .form-element-label{
                display: flex;
                justify-content: space-between;
                margin-bottom: 1em;
                width: 100%;
            }
            
            .form-element-label label,
            .form-element-label span{
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto' , sans-serif;
                font-weight: 600;
                font-size: 1em;
                transition: color 0.5s;
            }

            .form-element-label label.invalid::after{
                content: '*';
                color: hsl(0, 100%, 50%);
                font-size: 1.5em;
                margin-left: 0.2em;
            }

            .form-element-label,
            .form-element-input{
                width: 100%;
            }

            input[type="submit"]{
                background: none;
                color: inherit;
                border: none;
                padding: 0;
                font: inherit;
                cursor: pointer;
                outline: inherit;
            }
            
            .form-element-input input, 
            .form-element-input textarea,
            .form-element-input select {
                background-color:hsl(226deg 64% 66%);
                border: none;
                border-bottom: 0.1em solid  hsl(0, 0%, 100%);
                box-sizing: border-box;
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto' , sans-serif;
                font-weight: 600;
                padding: 0.5em;
                width: 100%;
            }

            .form-element-input input:focus,
            .form-element-input textarea:focus,
            .form-element-input select:focus{
                outline: none;
                border-bottom: 0.1em solid hsl(207, 85%, 69%);
            }

            .form-element-input input.invalid,
            .form-element-input textarea.invalid{
                border-bottom: 0.2em solid hsl(0, 100%, 50%);
            }

            .form-element-input textarea{
                height: 10em;
            }

            .form-element-input .checkbox-container,
            .form-element-input .radio-container{
                display: flex;
                align-items: center;
                gap: 0.5em;
            }

            .form-element-input .checkbox-container input,
            .form-element-input .radio-container input{
                width: 1em;
                height: 1em;
            }

            .form-element-input .checkbox-container label,
            .form-element-input .radio-container label{
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto' , sans-serif;
                font-weight: 600;
                font-size: 1em;
            }

            .form-element-input .range-container{
                display: flex;
                align-items: center;
                gap: 0.5em;
            }

            .form-element-input .range-container input{
                width: 100%;
            }

            .form-element-input .range-container label{
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto' , sans-serif;
                font-weight: 600;
                font-size: 1em;
            }

            .form-element-input .range-container .range-value{
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto' , sans-serif;
                font-weight: 600;
                font-size: 1em;
            }

            .form-element-input .range-container input[type="range"]{
                -webkit-appearance: none;
                width: 100%;
                height: 0.5em;
                border-radius: 0.5em;
                background: hsl(0, 0%, 100%);
                outline: none;
                opacity: 0.7;
                -webkit-transition: .2s;
                transition: opacity .2s;
            }

            .form-element-input input[type="time"]::-webkit-calendar-picker-indicator,
            .form-element-input input[type="date"]::-webkit-calendar-picker-indicator{
                filter: invert(1);
            }
        </style>
        
        <form autocomplete="off">
                                
            <input autocomplete="false" name="hidden" type="text" style="display:none;">

            <div class="tabs-container-menu">
                <div class="tabs-container-items">
                   <ul>
                   </ul>
                </div>

                <div class="tabs-container-buttons">
                    <div id="create-button"> 
                        <svg viewBox="0 0 24 24">
                            <path d="M19.36,2.72L20.78,4.14L15.06,9.85C16.13,11.39 16.28,13.24 15.38,14.44L9.06,8.12C10.26,7.22 12.11,7.37 13.65,8.44L19.36,2.72M5.93,17.57C3.92,15.56 2.69,13.16 2.35,10.92L7.23,8.83L14.67,16.27L12.58,21.15C10.34,20.81 7.94,19.58 5.93,17.57Z" />
                        </svg>
                    </div>
                    <div id="store-button"> 
                        <label>
                            <input type="submit" value="">
                            <svg viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path class="crud__create-button-icon" d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                            </svg>
                        </label> 
                    </div>
                </div>
            </div>

            <div class="errors-container">

            </div>

            <div class="tabs-container-content"></div>
        </form>
        `;      

        const form = this.shadow.querySelector('form');
        const tabsContainerItems = this.shadow.querySelector('.tabs-container-items ul'); 
        const tabsContainerContent = this.shadow.querySelector('.tabs-container-content'); 

        for (let tab in this.formStructure.tabs) {

            const tabElement = document.createElement('li');
            tabElement.classList.add('tab-item');        
            tabElement.dataset.tab = tab;
            tabElement.innerHTML = this.formStructure.tabs[tab].label;
            tabsContainerItems.appendChild(tabElement);

            const tabPanel = document.createElement('div');
            tabsContainerContent.appendChild(tabPanel);

            for (let row in this.formStructure.tabsContent[tab].rows) {

                tabPanel.dataset.tab = tab;
                tabPanel.classList.add('tab-panel');

                const tabPanelRow = document.createElement('div');
                tabPanelRow.classList.add('row');

                for (let field in this.formStructure.tabsContent[tab].rows[row].formElements) {

                    let formElement = this.formStructure.tabsContent[tab].rows[row].formElements[field];

                    const formElementContainer = document.createElement('div');
                    const formElementLabel = document.createElement('div');
                    const formElementInput = document.createElement('div');
                    formElementContainer.appendChild(formElementLabel);
                    formElementContainer.appendChild(formElementInput);
        
                    formElementContainer.classList.add('form-element');
                    formElementLabel.classList.add('form-element-label');
                    formElementInput.classList.add('form-element-input');
        
                    if(formElement.label){
                        const label = document.createElement('label');
                        label.innerText = formElement.label;
                        label.setAttribute('for', `${formElement.label}`);
                        formElementLabel.appendChild(label);
                    }
     
                    if (formElement.element === 'input') {
        
                        switch (formElement.type) {

                            case 'hidden': {

                                const input = document.createElement('input');
                                input.type = formElement.type;
                                input.name = field;
                                input.value = formElement.value || '';

                                form.appendChild(input);

                                continue;
                            }

                            case 'checkbox':
                            case 'radio': {
        
                                const inputContainer = document.createElement('div');
                                inputContainer.classList.add(`${formElement.type}-container`);
                
                                formElement.options.forEach(option => {
                                    const input = document.createElement('input');
                                    const inputLabel = document.createElement('label');
                                    inputLabel.innerText = option.label;
                                    input.type = formElement.type;
                                    input.name = field;
                                    input.value = option.value || '';
                                    input.checked = option.checked || false;
                                    input.disabled = option.disabled || false;

                                    inputContainer.appendChild(inputLabel);
                                    inputContainer.appendChild(input);
                                });

                                formElementInput.appendChild(inputContainer);

                                break;
                            }

                            case 'range': {

                                const rangeContainer = document.createElement('div');
                                rangeContainer.classList.add('range-container');
                
                                const input = document.createElement('input');
                                input.type = formElement.type;
                                input.name = field;
                                input.min = formElement.min || '';
                                input.max = formElement.max || '';
                                input.step = formElement.step || '';
                                input.value = formElement.value || '';
                                rangeContainer.appendChild(input);

                                const rangeValue = document.createElement('span');
                                rangeValue.classList.add('range-value');
                                rangeValue.innerText = formElement.value;
                                rangeContainer.appendChild(rangeValue);

                                input.addEventListener('input', () => {
                                    rangeValue.innerText = input.value;
                                });

                                formElementInput.appendChild(rangeContainer);

                                break;
                            }

                            case 'number':
                            case 'date':
                            case 'time':
                            case 'datetime-local':
                            case 'month':
                            case 'week': {
                                const input = document.createElement('input');
                                input.type = formElement.type;
                                input.name = field;
                                input.min = formElement.min || '';
                                input.max = formElement.max || '';
                                input.step = formElement.step || '';
                                input.placeholder = formElement.placeholder || '';
                                input.value = formElement.value || '';
                                input.readOnly = formElement.readOnly || false;
                                input.dataset.validate = formElement.validate || '';

                                formElementInput.appendChild(input);
                            
                                break;
                            }

                            case 'file': {

                                if(!this.shadow.querySelector('image-gallery-component')){
                                    const imageGallery = document.createElement('image-gallery-component');
                                    this.shadow.appendChild(imageGallery);
                                }

                                const input = document.createElement('upload-image-button-component');
                                input.setAttribute("name", field);
                                input.setAttribute("quantity", formElement.quantity);

                                formElementInput.appendChild(input);

                                break;
                            }

                            default: {
                                
                                const input = document.createElement('input');
                                input.type = formElement.type;
                                input.name = field;
                                input.value = formElement.value || '';
                                input.placeholder = formElement.placeholder || '';
                                input.dataset.validate = formElement.validate || '';
                                  
                                if(formElement.maxLength){

                                    input.maxLength = formElement.maxLength || '';
                                    const counter = document.createElement('span');
                                    formElementLabel.appendChild(counter);

                                    input.addEventListener('input', () => {
                                        if(input.value.length > 0){
                                            counter.textContent = input.value.length + ' / ' + input.maxLength;                            
                                        }else{
                                            counter.textContent = '';
                                        }
                                    });
                                }
            
                                formElementInput.appendChild(input);

                                break;
                            }
                        }
                    }

                    if (formElement.element === 'textarea') {

                        const textarea = document.createElement('textarea');
                        textarea.name = field;
                        textarea.disabled = formElement.disabled || false;
                        textarea.readOnly = formElement.readOnly || false;
                        textarea.value = formElement.value || '';
                        textarea.cols = formElement.cols || '';
                        textarea.rows = formElement.rows || '';
                        textarea.wrap = formElement.wrap || '';
                        textarea.placeholder = formElement.placeholder || '';
                        textarea.dataset.validate = formElement.validate || '';
                       
                        if(formElement.maxLength){

                            textarea.maxLength = formElement.maxLength || '';
                            const counter = document.createElement('span');
                            formElementLabel.appendChild(counter);

                            textarea.addEventListener('input', () => {
                                if(textarea.value.length > 0){
                                    counter.textContent = textarea.value.length + ' / ' + textarea.maxLength;                            
                                }else{
                                    counter.textContent = '';
                                }
                            });
                        }

                        formElementInput.appendChild(textarea);
                    }
        
                    if (formElement.element === 'select') {
        
                        const select = document.createElement('select');
                        select.name = field;
                        select.disabled = formElement.disabled || false;
                        select.required = formElement.required || false;
                        select.multiple = formElement.multiple || false;
        
                        formElement.options.forEach(option => {
                            const optionElement = document.createElement('option');
                            optionElement.value = option.value;
                            optionElement.innerText = option.label;
                            select.appendChild(optionElement);
                        });
        
                        formElementInput.appendChild(select);
                    }

                    tabPanelRow.appendChild(formElementContainer);
                };

                tabPanel.appendChild(tabPanelRow);
            };
        }

        this.shadow.querySelector(".tab-item").classList.add("active");
        this.shadow.querySelector(".tab-panel").classList.add("active");
      
        this.renderTabs();
        this.renderSubmitForm();
        this.renderCreateForm();
        this.renderStoreForm();
    }

    renderSubmitForm = () => {
        let form = this.shadow.querySelector('form');
       
        form.addEventListener('submit', async (e) => {
            
            e.preventDefault();
        
            let formData = new FormData(form);
            const data = Object.fromEntries(formData);
            

            let url = `${API_URL}${this.getAttribute("url")}`;
        
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': sessionStorage.getItem('accessToken')
                    },

                    body: JSON.stringify(data)
                });
                console.log(formData);
        
                if(response.success){
                    this.render();
                    let result = await response.json();
                }else{
                    console.log("Fallo");
                }

            } catch (error) {
                console.error(error);
            }
        });

    }

    renderStoreForm = () => {

        let storeButton = this.shadow.getElementById('store-button');

        storeButton.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('save', {
                detail: {storeButton: storeButton.id }

            }));
            
        });
    }

    renderCreateForm = () => {
        let iconClear = this.shadow.getElementById('create-button')
      
        iconClear.addEventListener('click', (e) => {
            e.preventDefault();
      
            let form = this.shadow.querySelector('form');
      
            this.render(form);
        });
      }

    renderTabs = () => {

        let tabsItems = this.shadow.querySelectorAll('.tab-item');
        let tabPanels = this.shadow.querySelectorAll(".tab-panel");
    
        tabsItems.forEach(tabItem => { 
    
            tabItem.addEventListener("click", () => {
        
                let activeElements = this.shadow.querySelectorAll(".active");
        
                activeElements.forEach(activeElement => {
                    activeElement.classList.remove("active");
                });
                
                tabItem.classList.add("active");
        
                tabPanels.forEach(tabPanel => {
        
                    if(tabPanel.dataset.tab == tabItem.dataset.tab){
                        tabPanel.classList.add("active"); 
                    }
                });
            });
        });
    }


    async showElement(id){

        let url = `${API_URL}${this.getAttribute('url')}/${id}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'x-access-token': sessionStorage.getItem('accessToken')
                }
            });
        
            if(response.ok){
                let result = await response.json();
                console.log(result)

                for(const [key, value] of Object.entries(result)){
                    if(this.shadow.querySelector(`[name="${key}"]`)){
                        this.shadow.querySelector(`[name="${key}"]`).value = value;
                    }
                }
            }else{
                console.log("Fallo");
            }
    
        } catch (error) {
            console.error(error);
        }
    }

    async showDeleteModal(id){

        let url = `${API_URL}${this.getAttribute('url')}/${id}`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    
                    'x-access-token': sessionStorage.getItem('accessToken')
                }
            });

            if (response.ok) {
                console.log('Fila eliminada exitosamente');
            } else {
                console.log('Fallo al eliminar la fila');
            }
        } catch (error) {
            console.error(error);
        }
        
        this.render();
    }

    setFormStructure = async () => {
        
        let url = this.getAttribute('url');

        switch (url) {

            case '/api/admin/customers':

                return {

                    tabs:{
                        main: {
                            label: 'Principal',
                        },
                        images: {
                            label: 'Im??genes',
                        }
                    },

                    tabsContent: {
                        main: {
                            rows:{
                                row1: {
                                    formElements:{
                                        id:{
                                            element: 'input',
                                            type: 'hidden',
                                        },
                                        name: {
                                            label: 'Nombre',
                                            element: 'input',
                                            type: 'text',
                                            validate: 'only-letters'
                                        },
                                        surname: {
                                            label: 'Apellidos',
                                            element: 'input',
                                            type: 'text',
                                        }
                                    }
                                },
                                row2: {
                                    formElements:{
                                        email: {
                                            label: 'Email',
                                            element: 'input',
                                            type: 'email',
                                            validate: 'email'
                                        },
                                        phone: {
                                            label: 'Tel??fono',
                                            element: 'input',
                                            type: 'text',
                                            validate: 'only-numbers'
                                        }
                                    }
                                },
                                row3: {
                                    formElements:{
                                        mobile: {
                                            label: 'M??vil',
                                            element: 'input',
                                            type: 'text',
                                            validate: 'only-numbers'
                                        },
                                        address: {
                                            label: 'Direcci??n',
                                            element: 'input',
                                            type: 'text',
                                        }
                                    }
                                },
                                row4: {
                                    formElements:{
                                        province: {
                                            label: 'Provincia',
                                            element: 'input',
                                            type: 'text',
                                            validate: 'only-letters'
                                        },
                                        township: {
                                            label: 'Ciudad',
                                            element: 'input',
                                            type: 'text',
                                            validate: 'only-letters'
                                        },
                                    }
                                },
                                row5: {
                                    formElements:{
                                        postalCode: {
                                            label: 'C??digo Postal',
                                            element: 'input',
                                            type: 'text',
                                            validate: 'postal-code'
                                        },
                                        startingServiceDate: {
                                            label: 'Fecha de Inicio del Servicio',
                                            element: 'input',
                                            type: 'date',
                                            validate: 'date'
                                        }
                                    }
                                },
                                row6: {
                                    formElements:{
                                        onService: {
                                            label: 'En Servicio',
                                            element: 'select',
                                            options: [
                                                {
                                                    label: 'S??',
                                                    value: 'true',
                                                },
                                                {
                                                    label: 'No',
                                                    value: 'false',
                                                }
                                            ]
                                        },
                                        identifyNumber: {
                                            label: 'N??mero de Identificaci??n',
                                            element: 'input',
                                            type: 'number',
                                        }
                                    }
                                },
                                row7: {
                                    formElements:{
                                        comment: {
                                            label: 'Comentario',
                                            element: 'textarea',
                                        }
                                    }
                                },
                                row8: {
                                    formElements:{
                                        id:{
                                            element: 'input',
                                            type: 'hidden',
                                        },
                                    }
                                }
                            }
                        },

                        images: {
                            rows:{
                                row1: {
                                    formElements:{
                                        flyer: {
                                            label: 'Flyer',
                                            element: 'input',
                                            type: 'file',
                                        },
                                    }
                                },
                            }
                        }
                    }
                };    

            case '/api/admin/emails':

                return {

                    tabs:{
                        main: {
                            label: 'Principal',
                        },
                        images: {
                            label: 'Im??genes',
                        }
                    },

                    tabsContent: {
                        main: {
                            rows:{
                                row1: {
                                    formElements:{
                                        id:{
                                            element: 'input',
                                            type: 'hidden',
                                        },
                                        subject: {
                                            label: 'Asunto',
                                            element: 'input',
                                            type: 'text',
                                            validate: ["required"]
                                        }
                                    }
                                },
                                row2: {
                                    formElements:{
                                        content: {
                                            label: 'Contenido',
                                            element: 'textarea',
                                            validate: ["required"]
                                        }
                                    }
                                },
                            }
                        },

                        images: {
                            rows:{
                                row1: {
                                    formElements:{
                                        flyer: {
                                            label: 'Flyer',
                                            element: 'input',
                                            type: 'file',
                                            quantity: "multiple"
                                        },
                                    }
                                },
                            }
                        }
                    }
                };

            case '/api/admin/ejemplo':

                return {

                    tabs:{
                        main: {
                            label: 'Principal',
                        },
                        images: {
                            label: 'Im??genes',
                        }
                    },

                    tabsContent: {
                        
                        main: {
                            rows:{
                                row1: {
                                    formElements:{
                                        id:{
                                            element: 'input',
                                            type: 'hidden',
                                        },
                                        name: {
                                            label: 'Nombre',
                                            element: 'input',
                                            maxLength: '10',
                                            type: 'text',
                                            placeholder: '',
                                            required: true,
                                            validate: 'only-letters'
                                        },
                                        email: {
                                            label: 'Email',
                                            element: 'input',
                                            type: 'email',
                                            placeholder: '',
                                            required: true,
                                            validate: 'email'
                                        }
                                    }
                                },
                                row2: {
                                    formElements:{
                                        password: {
                                            label: 'Contrase??a',
                                            element: 'input',
                                            type: 'password',
                                            placeholder: '',
                                            required: true
                                        },
                                        repeatPassword: {
                                            label: 'Repita la contrase??a',
                                            element: 'input',
                                            type: 'password',
                                            placeholder: '',
                                            required: true
                                        }
                                    }
                                },
                                row3: {
                                    formElements:{
                                        permissions: {
                                            label: 'Permisos',
                                            element: 'input',
                                            type: 'checkbox',
                                            required: true,
                                            options: [
                                                {
                                                    label: 'Crear',
                                                    value: 'create',
                                                    checked: true
                                                },
                                                {
                                                    label: 'Leer',
                                                    value: 'read'
                                                },
                                                {
                                                    label: 'Actualizar',
                                                    value: 'update'
                                                },
                                                {
                                                    label: 'Eliminar',
                                                    value: 'delete'
                                                }
                                            ]
                                        },
                                        sex: {
                                            label: 'Sexo',
                                            element: 'input',
                                            type: 'radio',
                                            required: true,
                                            options: [
                                                {
                                                    label: 'Masculino',
                                                    value: "M",
                                                    checked: true
                                                },
                                                {
                                                    label: 'Femenino',
                                                    value: "F"
                                                }
                                            ],
                                        }
                                    }
                                },
                                row4: {
                                    formElements:{
                                        color: {
                                            label: 'Color',
                                            element: 'input',
                                            type: 'color',
                                            placeholder: ''
                                        },
                                        role: {
                                            label: 'Rol',
                                            element: 'select',
                                            required: true,
                                            options: [
                                                {
                                                    label: 'Administrador',
                                                    value: 'admin'
                                                },
                                                {
                                                    label: 'Usuario',
                                                    value: 'user'
                                                }
                                            ]
                                        }
                                    }
                                },
                                row5: {
                                    formElements:{
                                        edad: {
                                            label: 'Edad',
                                            element: 'input',
                                            type: 'number',
                                            placeholder: '',
                                            required: true
                                        },
                                        telefono: {
                                            label: 'Tel??fono',
                                            element: 'input',
                                            type: 'tel',
                                            placeholder: '',
                                            required: true
                                        },
                                        url: {
                                            label: 'URL',
                                            element: 'input',
                                            type: 'url',
                                            placeholder: '',
                                            required: true
                                        }
                                    }
                                },
                                row6: {
                                    formElements:{
                                        creationDate: {
                                            label: 'Fecha de creaci??n',
                                            element: 'input',
                                            type: 'date',
                                            placeholder: '',
                                            required: true,
                                            validate: 'date'
                                        },
                                        creationTime: {
                                            label: 'Hora de creaci??n',
                                            element: 'input',
                                            type: 'time',
                                            placeholder: '',
                                            required: true
                                        }
                                    }
                                },
                                row7: {
                                    formElements:{
                                        reservationWeek: {
                                            label: 'Semana de reserva',
                                            element: 'input',
                                            type: 'week',
                                            placeholder: '',
                                            required: true
                                        },
                                        reservationMonth: {
                                            label: 'Mes de reserva',
                                            element: 'input',
                                            type: 'month',
                                            placeholder: '',
                                            required: true
                                        },
                                        reservationDateTime: {
                                            label: 'Fecha y hora',
                                            element: 'input',
                                            type: 'datetime-local',
                                            placeholder: '',
                                            required: true
                                        }
                                    }
                                },
                                row8: {
                                    formElements:{
                                        capital: {
                                            label: 'Capital',
                                            element: 'input',
                                            type: 'range',
                                            min: 0,
                                            max: 100,
                                            step: 1,
                                            value: 50,
                                            placeholder: ''
                                        },
                                    }
                                    
                                },
                                row9: {
                                    formElements:{
                                        pdf: {
                                            label: 'Pdf',
                                            element: 'input',
                                            type: 'file',
                                            placeholder: '',
                                            required: true
                                        },
                                        search: {
                                            label: 'Buscar',
                                            element: 'input',
                                            type: 'search',
                                            placeholder: '',
                                            required: true
                                        }
                                    }
                                },
                                row10: {
                                    formElements:{
                                        description: {
                                            label: 'Descripci??n',
                                            element: 'textarea',
                                            maxLength: 100,
                                            placeholder: '',
                                            required: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
            case '/api/admin/users':

                return{

                    tabs:{
                        main: {
                            label: 'Principal',
                        }
                    },

                    tabsContent: {
                        main: {
                            rows:{
                                row1: {
                                    formElements:{
                                        id:{
                                            element: 'input',
                                            type: 'hidden',
                                        },
                                        name: {
                                            label: 'Nombre',
                                            element: 'input',
                                            type: 'text',
                                            validate: 'only-letters'
                                        },
                                        email: {
                                            label: 'Email',
                                            element: 'input',
                                            type: 'email',
                                            placeholder: '',
                                            required: true,
                                            validate: 'email'
                                        }
                                    }
                                },
                                row2: {
                                    formElements:{
                                        password: {
                                            label: 'Contrase??a',
                                            element: 'input',
                                            type: 'password',
                                            placeholder: '',
                                            required: true
                                        },
                                        repeatPassword: {
                                            label: 'Repita la contrase??a',
                                            element: 'input',
                                            type: 'password',
                                            placeholder: '',
                                            required: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
        }
    }
}

customElements.define('form-builder', FormBuilder);