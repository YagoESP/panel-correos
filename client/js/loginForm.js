

    class LoginForm extends HTMLElement {

        constructor() {
            super();
            this.shadow = this.attachShadow({mode: 'open'});
            this.action = this.getAttribute('action');
            this.render();
        }
    
        render() {
    
            this.shadow.innerHTML =
            `
            <style>
    
                form{
                    width: 100%;
                }
    
                .form-element{
                    margin-bottom: 1em;
                    width: 100%;
                }
    
                .form-element-label{
                    margin-bottom: 0.5em;
                }
    
                .form-element-label label{
                    color: hsl(0, 0%, 100%);
                    font-family: "Ubuntu";
                    font-weight: 600;
                    font-size: 1em;
                    transition: color 0.5s;
                }
    
                .form-element-input{
                    width: 100%;
                }
    
                .form-element-input input{
                    background-color:hsl(226, 63%, 45%);
                    border: none;
                    border-bottom: 0.1em solid  hsl(0, 0%, 100%);
                    box-sizing: border-box;
                    color: hsl(0, 0%, 100%);
                    font-family: "Ubuntu";
                    font-weight: 600;
                    padding: 0.2em;
                    width: 100%;
                }
    
                .form-submit{
                    background-color: transparent;
                    border-radius: 1em;
                    border: 0.2rem solid white;
                    color: white;
                    cursor: pointer;
                    float: right;
                    font-size: 1.2em;
                    font-weight: 600;
                    letter-spacing: 0;
                    line-height: 0px;
                    margin-top: 1em;
                    min-width: 20%;
                    padding: 1em 2em;
                    transition: 0.5s;
                    text-decoration: none;
                }
            </style>
            <form class="login">
                <h2>INICIAR SESIÓN</h2>
                <div class="login-usuario">
                    <label for="text"><h3>EMAIL</h3></label>
                    <input type="text" name="email">
                </div>
                <div class="login-contra">
                    <label for="password"><h3>CONTRASEÑA</h3></label>
                    <input type="password" name="password">
                </div>
                <div class="login-boton">
                    <button class="loginBoton">INGRESAR</button>
                </div> 
            </form>
            `;
    
            const form = this.shadow.querySelector('form');
    
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.submitForm(form);
            });
        }
    
        async submitForm(form) {
    
            const formData = new FormData(form);
            let formDataJson = Object.fromEntries(formData.entries());
    
            try{
                let result = await fetch(this.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataJson)
                });
       
                if (result.ok) {
                    let data = await result.json();
                    sessionStorage.setItem('accessToken', data.accessToken);
                    window.location.href = this.getAttribute('redirection');
                } else {
                    let error = await result.json();
                    console.log(error.message);
                }
               
            }catch(error){
                console.log(error);
            }
        }
    }
    
    customElements.define('login-form', LoginForm);