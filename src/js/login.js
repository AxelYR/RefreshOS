// src/js/login.js

// URLs de la API (Backend)
const API_REGISTER_URL = 'http://localhost:9090/register';
const API_LOGIN_URL = 'http://localhost:9090/login';

document.addEventListener('DOMContentLoaded', () => {
    //Referencias a los formularios 
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    //Manejador para el formulario de REGISTRO 
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Evita que la página se recargue

            // Obtener los valores de los campos de registro
            const email = document.getElementById('email-register').value;
            const password = document.getElementById('password-register').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;

            //validar  del lado del cliente 
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
                return; //Detiene la ejecución
            }
            if (!terms) {
                alert('Debes aceptar los términos y condiciones para registrarte.');
                return; //Detiene la ejecución
            }

            // Mostrar un estado de "cargando" en el botón
            const registerButton = document.getElementById('register-button');
            registerButton.disabled = true;
            registerButton.textContent = 'Registrando...';

            try {
                // solicitud POST al backend
                const response = await fetch(API_REGISTER_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) { // 201 Created
                    alert('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.');
                    registerForm.reset(); // Limpia el formulario
                } else {
                    // Manejar errores 
                    const errorData = await response.json();
                    alert(`Error al registrarse: ${errorData.error}`);
                }
            } catch (error) {
                console.error('Error de red al registrar:', error);
                alert('Hubo un problema al conectar con el servidor. Intenta de nuevo.');
            } finally {
                // Restaurar el botón
                registerButton.disabled = false;
                registerButton.textContent = 'Registrarme';
            }
        });
    }

    //  Manejador para el formulario de LOGIN 
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Evita que la página se recargue

            // Obtener valores de los campos de login
            const email = document.getElementById('email-login').value;
            const password = document.getElementById('password-login').value;

            // Mostrar estado de "cargando"
            const loginButton = document.getElementById('login-button');
            loginButton.disabled = true;
            loginButton.textContent = 'Ingresando...';

            try {
                //solicitud POST al backend
                const response = await fetch(API_LOGIN_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) { // 200 OK
                    const data = await response.json();
                    
                    // Guardar al usuario en el localStorage del navegador
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    
                    alert('¡Inicio de sesión exitoso! Serás redirigido a la tienda.');
                    
                    // redirigir al usuario a la página de compras
                    window.location.href = '/html/compras.html';

                } else {
                    // manejar errores (404 - no encontrado, 401 - contraseña incorrecta)
                    const errorData = await response.json();
                    alert(`Error al iniciar sesión: ${errorData.error}`);
                }
            } catch (error) {
                console.error('Error de red al iniciar sesión:', error);
                alert('Hubo un problema al conectar con el servidor. Intenta de nuevo.');
            } finally {
                // Restaurar el boton
                loginButton.disabled = false;
                loginButton.textContent = 'Ingresar';
            }
        });
    }
});