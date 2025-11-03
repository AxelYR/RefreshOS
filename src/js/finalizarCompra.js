document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos HTML
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const paymentForm = document.getElementById('payment-form');
    
    // URLs de la API
    const CART_API_URL = 'http://localhost:9090/cart';
    const ORDER_API_URL = 'http://localhost:9090/order';

    let currentCartItems = []; // Almacenar los items del carrito

    // Revisar si hay un usuario logueado
    const userJSON = localStorage.getItem('currentUser');
    const user = userJSON ? JSON.parse(userJSON) : null;

    if (user && user.email) {
        // Si hay usuario, buscar el campo de email
        const emailInput = document.getElementById('email');
        if (emailInput) {
            // Autocompletar y deshabilitar el campo
            emailInput.value = user.email;
            emailInput.disabled = true;
        }
    }
    
    // Función para obtener y mostrar el contenido del carrito
    async function fetchAndDisplayCart() {
        if (!cartItemsContainer || !cartTotalElement) {
            console.error('Error: Faltan contenedores HTML (cart-items-container o cart-total).');
            return;
        }

        try {
            const response = await fetch(CART_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const cart = await response.json();
            currentCartItems = cart; // Guardar el carrito actual
            renderCartItems(cart); // Llamar a la función para renderizar
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            cartItemsContainer.innerHTML = '<p class="text-red-500">Error al cargar el carrito. Por favor, intente de nuevo más tarde.</p>';
            cartTotalElement.textContent = '$0.00';
        }
    }

    // Función para renderizar los elementos del carrito en la página
    function renderCartItems(cart) {
        cartItemsContainer.innerHTML = ''; // Limpia el contenedor
        let total = 0;
        
        const submitButton = paymentForm.querySelector('button[type="submit"]');

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-gray-600">Tu carrito está vacío.</p>';
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.classList.add('opacity-50', 'cursor-not-allowed');
            }
        } else {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
            }

            cart.forEach(item => {
                const itemPrice = item.precio * item.cantidad;
                total += itemPrice;
                const imageUrl = `http://localhost:9090${item.ruta_imagen}`; // URL completa

                const cartItemDiv = document.createElement('div');
                cartItemDiv.className = 'flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-4';
                cartItemDiv.innerHTML = `
                    <div class="flex items-center flex-grow">
                        <div class="flex-shrink-0 w-20 h-20 overflow-hidden rounded-md mr-4">
                            <img src="${imageUrl}" alt="${item.nombre}" 
                                class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${item.nombre}</h3>
                            <p class="text-gray-600 dark:text-gray-400">Cantidad: ${item.cantidad}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-300">Precio unitario: $${item.precio.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="flex flex-col items-end">
                        <span class="text-lg font-bold text-gray-900 dark:text-white mb-2">$${itemPrice.toFixed(2)}</span>
                        <button class="remove-item-btn text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
                                data-item-id="${item.id}" aria-label="Eliminar ${item.nombre}">
                            Eliminar
                        </button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }

        cartTotalElement.textContent = `$${total.toFixed(2)}`;

        // Añadir event listeners a los botones de eliminar
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', handleRemoveItem);
        });
    }

    // Funcion para eliminar un producto del carrito
    async function handleRemoveItem(event) {
        const itemId = event.target.dataset.itemId;
        if (!itemId) return;

        try {
            const response = await fetch(`${CART_API_URL}/${itemId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error al eliminar');

            alert('Artículo eliminado del carrito.');
            fetchAndDisplayCart(); // Recargar el carrito

        } catch (error) {
            console.error('Error al eliminar del carrito:', error);
            alert('Error al eliminar el artículo. Intente de nuevo.');
        }
    }

    // Manejar el envío del formulario de pago
    paymentForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evitar el envío predeterminado

        if (currentCartItems.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }

        // recopilar la información del cliente
        const customerInfo = {
            nombre: document.getElementById('nombre').value,
            direccion: document.getElementById('direccion').value,
            email: document.getElementById('email').value // Esto leerá el valor (incluso si está deshabilitado)
        };

        // recopilar el total
        const total = parseFloat(cartTotalElement.textContent.replace('$', ''));

        const orderData = {
            customerInfo,
            cartItems: currentCartItems,
            total
        };

        const submitButton = paymentForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Procesando...';

        try {
            // Enviar la orden al backend
            const response = await fetch(ORDER_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Error al procesar la orden');
            }

            alert('¡Pedido confirmado con éxito! Tu carrito ha sido vaciado.');
            window.location.href = '/html/misPedidos.html'; // Redirigir a "Mis Pedidos"

        } catch (error) {
            console.error('Error al confirmar el pedido:', error);
            alert('Error al confirmar el pedido. Por favor, intente de nuevo.');
            submitButton.disabled = false;
            submitButton.textContent = 'Confirmar Pedido';
        }
    });

    // Carga inicial
    // Verificar que los elementos base existen antes de hacer el fetch
    if (cartItemsContainer && cartTotalElement && paymentForm) {
        fetchAndDisplayCart();
    } else {
        console.error('Error crítico: Faltan elementos HTML (cart-items-container, cart-total o payment-form).');
    }
});