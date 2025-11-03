document.addEventListener('DOMContentLoaded', () => {
    
    // Contenedores
    const ordersContainer = document.getElementById('orders-container');
    const placeholder = document.getElementById('pedidos-placeholder');

    //Revisar si el usuario está logueado
    const userJSON = localStorage.getItem('currentUser');
    const user = userJSON ? JSON.parse(userJSON) : null;

    if (!user || !user.email) {
        // Si no hay usuario, mostrar un error
        placeholder.innerHTML = `
        <div class="container mx-auto px-4 text-center">
          <div class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8 border border-dashed border-gray-300 dark:border-gray-700">
            <div class="flex flex-col items-center">
              <svg class="w-16 h-16 text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Acceso Denegado</h2>
              <p class="text-gray-600 dark:text-gray-400">
                Necesitas iniciar sesión para ver tus pedidos.
              </p>
              <a href="/html/login.html" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Iniciar Sesión</a>
            </div>
          </div>
        </div>
        `;
        placeholder.classList.remove('hidden');
        return; // Detener
    }

    //Si hay usuario, buscar sus pedidos
    fetchUserOrders(user.email);
});

async function fetchUserOrders(email) {
    const ordersContainer = document.getElementById('orders-container');
    const placeholder = document.getElementById('pedidos-placeholder');
    
    // URL de la nueva API, pasando el email como query 
    const API_MY_ORDERS_URL = `http://localhost:9090/my-orders?email=${encodeURIComponent(email)}`;

    try {
        const response = await fetch(API_MY_ORDERS_URL);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const orders = await response.json();

        // Renderizar
        if (orders.length === 0) {
            // El usuario existe pero no tiene pedidos
            placeholder.classList.remove('hidden'); // Mostramos el placeholder de "no hay pedidos"
        } else {
            // El usuario tiene pedidos, los ponemos
            placeholder.classList.add('hidden'); // Ocultamos el placeholder
            renderOrders(orders, ordersContainer);
        }

    } catch (error) {
        console.error('Error al cargar mis pedidos:', error);
        placeholder.innerHTML = `
        <div class="container mx-auto px-4 text-center">... (código del placeholder de error) ...</div>
        `;
        placeholder.classList.remove('hidden');
    }
}

function renderOrders(orders, container) {
    container.innerHTML = ''; // Limpiar

    // Usamos el componente Acordeón de Flowbite
    const accordionContainer = document.createElement('div');
    accordionContainer.id = 'accordion-collapse';
    accordionContainer.setAttribute('data-accordion', 'collapse');

    // Revertimos las órdenes para mostrar la más reciente primero
    orders.reverse().forEach((order, index) => {
        const orderId = order.orderId;
        const total = order.total;
        
        // Formatear la fecha
        const date = new Date(order.timestamp);
        const formattedDate = date.toLocaleDateString('es-MX', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        // Crear el HTML para los productos dentro del acordeón
        let itemsHtml = '<ul class="list-disc pl-5 text-gray-500 dark:text-gray-400">';
        order.cartItems.forEach(item => {
            itemsHtml += `<li>${item.nombre} (Cantidad: ${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}</li>`;
        });
        itemsHtml += '</ul>';
        
        //Crear el HTML del Acordeón
        const accordionItem = document.createElement('div');
        
        const headingId = `accordion-heading-${index}`;
        const bodyId = `accordion-body-${index}`;

        accordionItem.innerHTML = `
            <h2 id="${headingId}">
              <button type="button" 
                class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" 
                data-accordion-target="#${bodyId}" 
                aria-expanded="${index === 0 ? 'true' : 'false'}" 
                aria-controls="${bodyId}">
                
                <span class="flex-1 text-left">
                <span class="block font-bold">Pedido #${orderId}</span>
                <span class="block text-sm">${formattedDate}</span>
                </span>
                <span class="text-lg font-bold mr-4">$${total.toFixed(2)}</span>
                
                <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
                </svg>
              </button>
            </h2>
            <div id="${bodyId}" class="${index === 0 ? '' : 'hidden'}" aria-labelledby="${headingId}">
            <div class="p-5 border border-t-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                <p class="mb-2 text-gray-500 dark:text-gray-400"><strong>Cliente:</strong> ${order.customerInfo.nombre}</p>
                <p class="mb-2 text-gray-500 dark:text-gray-400"><strong>Email:</strong> ${order.customerInfo.email}</p>
                <p class="mb-4 text-gray-500 dark:text-gray-400"><strong>Dirección:</strong> ${order.customerInfo.direccion}</p>
                <h4 class="font-semibold mb-2 text-gray-700 dark:text-gray-300">Artículos:</h4>
                ${itemsHtml}
            </div>
            </div>
        `;
        accordionContainer.appendChild(accordionItem);
    });

    container.appendChild(accordionContainer);
    
    initFlowbite();
}
