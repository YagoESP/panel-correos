export let Clientes = () => {

    class Clientes  extends HTMLElement {
        
        constructor() {
            super();
            this.shadow = this.attachShadow({mode: 'open'});
            this.menu = this.get;
            this.render();
        }    
            
        render() {
            
            this.shadow.innerHTML =
                    `
            <style>
                
                        
            </style>

            <div class="panel">
            <div class="panel-clientes">
                <div class="titulos">
                    <div class="titulo">
                        <h2>NOMBRE</h2>
                    </div>
                    <div class="titulo">
                        <h2>APELLIDOS</h2>
                    </div>
                    <div class="titulo">
                        <h2>CORREOS</h2>
                    </div>
    
                    <div class="titulo">
                        <h2>
                            <svg style="width:24px;height:24px" viewBox="0 0 24 24" class="agregar-icon">
                                <path fill="currentColor" d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                            </svg>
                        </h2>
                    </div>
                    
                    <div class="titulo">
                        <h2>
                            <svg style="width:24px;height:24px" viewBox="0 0 24 24" class="filtro-icon">
                                <path fill="currentColor" d="M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z" />
                            </svg>
                        </h2>
                    </div>
    
                        
                </div>
                <div class="correos">
                    <div class="correo-cliente">
                        <div class="informacion">
                            <p>Pago</p>
                        </div>
                        <div class="informacion">
                            <p>Pago a deber</p>
                        </div>
                        
                        <div class="informacion">
                            <p>hola@gmail.com</p>
                        </div>
                    </div>
                    <div class="correo-iconos-clientes">
                        <div class="iconos">
                            <p>
                                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                                </svg>
                            </p>
                        </div>
                        <div class="iconos"> 
                            <p>
                                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                                </svg>
                            </p>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        
        <div class="agregar">
            <div class="model">
                <div class="model-filtro">
                    <h4>AGREGAR</h4>
                    <svg  viewBox="0 0 24 24" class="cerrar">
                        <path fill="currentColor" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" />
                    </svg>
                </div>
                <form class="agregarForm">
                    <div class="model-input">
                        <input type="text" placeholder="NOMBRE" name="name">
                        <input type="text" placeholder="APELLIDOS" name="surname">
                    </div>
                    <div class="model-input">
                        <input type="number" placeholder="EN SERVICIO" name="onService">
                        <input type="email" placeholder="CORREO" name="email">
                        <input type="number" placeholder="NUMERO DE IDENTIFICACION" name="identifyNumber">
                    </div>
                    <div class="model-input">
                        <input type="date" placeholder="D. DE INICIO" name="startingServiceDate">
                        <input type="number" placeholder="TELEFONO" name="phone">
                        <input type="text" placeholder="DIRECCION" name="address">
                    </div>
                    <div class="model-input">
                        <input type="number" placeholder="C.P." name="postalCode">
                        <input type="text" placeholder="CIUDAD" name="city">
                    </div>
                    <div class="model-input">
                        <input type="text" placeholder="PROVINCIA" name="province">
                        <input type="text" placeholder="COMENTARIO" name="comment">
                    </div>
                    <button>BUSCAR</button>
                </form>
                
            </div>
        </div>
    
        <div class="filtro">
            
            <div class="model">
                <div class="model-filtro">
                    <h4>FILTROS</h4>
                    <svg  viewBox="0 0 24 24" class="cerrar">
                        <path fill="currentColor" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" />
                    </svg>
                </div>
                <div class="model-input">
                    <input type="text" placeholder="NOMBRE">
                    <input type="text" placeholder="APELLIDOS">
                    <input type="text" placeholder="CORREO">
                </div>
                <button>BUSCAR</button>
            </div>
            
        </div>
                 
            `;      

            
        }        
    }
            
    customElements.define('clientes', Clientes);
}
