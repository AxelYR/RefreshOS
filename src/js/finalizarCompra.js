const CART_API_URL = 'http://localhost:9090/cart';
const ORDER_API_URL = 'http://localhost:9090/order';

// Variable para almacenar los ítems actuales del carrito
let currentCartItems = [];

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos HTML
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartTotalElement = document.getElementById('cart-total');
    const paymentForm = document.getElementById('payment-form');

    // Verificar que los elementos existan
    if (!cartItemsContainer || !cartSubtotalElement || !cartTotalElement || !paymentForm) {
        console.error('Error: Faltan elementos HTML en finalizarCompra.html');
        return;
    }

    // --- Función para obtener y mostrar el contenido del carrito ---
    async function fetchAndDisplayCart() {
        try {
            const response = await fetch(CART_API_URL);
            if (!response.ok) throw new Error('Error al cargar carrito');
            
            const cart = await response.json();
            currentCartItems = cart; // Guardar el carrito
            renderCartItems(cart); // Renderizar
        } catch (error) {
            console.error(error);
            cartItemsContainer.innerHTML = '<p class="text-red-500">Error al cargar el carrito.</p>';
        }
    }

    // --- Función para renderizar los elementos del carrito ---
    function renderCartItems(cart) {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        const submitButton = paymentForm.querySelector('button[type="submit"]');

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-gray-600 dark:text-gray-400">Tu carrito está vacío.</p>';
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
                const imageUrl = `http://localhost:9090${item.ruta_imagen}`; 

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
                                data-item-id="${item.id}">
                            Eliminar
                        </button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }

        // Actualizar totales
        cartSubtotalElement.textContent = `$${total.toFixed(2)}`;
        cartTotalElement.textContent = `$${total.toFixed(2)}`; // Asumiendo envío gratis

        // Añadir listeners a los botones de eliminar
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', handleRemoveItem);
        });
    }

    // --- Función para eliminar un producto del carrito ---
    async function handleRemoveItem(event) {
        const itemId = event.target.dataset.itemId;
        if (!itemId) return;

        try {
            const response = await fetch(`${CART_API_URL}/${itemId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar');
            
            // Recargar el carrito y el contador del navbar
            fetchAndDisplayCart();
            if (window.loadNavbar) {
                window.loadNavbar(); // Asumiendo que loadNavbar está en el scope global
            } else if (typeof importScripts === 'function') {
                // Si estamos en un módulo, necesitamos una forma de recargar el navbar.
                // Lo más fácil es recargar la página, pero lo ideal es que navbar.js exponga updateCartCounter
                location.reload(); // Recarga la página para ver el cambio
            }

        } catch (error) {
            console.error('Error al eliminar del carrito:', error);
            alert('Error al eliminar producto.');
        }
    }

    // --- Manejar el envío del formulario de pago ---
    paymentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (currentCartItems.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }

        const customerInfo = {
            nombre: document.getElementById('nombre').value,
            direccion: document.getElementById('direccion').value,
            email: document.getElementById('email').value
        };
        const total = parseFloat(cartTotalElement.textContent.replace('$', ''));

        const orderData = {
            customerInfo,
            cartItems: currentCartItems,
            total
        };

        try {
            const response = await fetch(ORDER_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) throw new Error('Error al crear la orden');
            
            alert('¡Pedido confirmado con éxito! Gracias por tu compra.');
            
            // Redirigir a "Mis Pedidos" o al inicio
            window.location.href = './misPedidos.html'; // o './index.html'

        } catch (error) {
            console.error('Error al confirmar el pedido:', error);
            alert('Error al confirmar el pedido. Intenta de nuevo.');
        }
    });

    // Carga inicial del carrito
    fetchAndDisplayCart();
});
