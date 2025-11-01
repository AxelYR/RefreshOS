const API_URL_DATA = 'http://localhost:9090/data';
const API_URL_CART = 'http://localhost:9090/cart';

document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayProducts();
});

async function fetchAndDisplayProducts() {
    const productContainer = document.getElementById('product-list-container');
    const errorPlaceholder = document.getElementById('products-placeholder');

    if (!productContainer || !errorPlaceholder) {
        console.error('Error: Faltan contenedores HTML (product-list-container o products-placeholder)');
        return;
    }

    try {
        const response = await fetch(API_URL_DATA);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const products = await response.json();

        productContainer.innerHTML = ''; // Limpiar por si acaso

        if (products.length === 0) {
            // No hay productos, mostrar placeholder
            errorPlaceholder.classList.remove('hidden');
            productContainer.classList.add('hidden');
            return;
        }

        // Si hay productos, ocultar error y mostrar contenedor
        errorPlaceholder.classList.add('hidden');
        productContainer.classList.remove('hidden');

        products.forEach(product => {
            const card = createProductCard(product);
            productContainer.appendChild(card);
        });

        // Añadir listeners a los botones "Añadir"
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', handleAddToCart);
        });

    } catch (error) {
        console.error('Error al cargar productos:', error);
        // Mostrar placeholder de error
        errorPlaceholder.classList.remove('hidden');
        productContainer.classList.add('hidden');
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700';
    
    // Convertir la ruta del producto a una URL completa de nuestra API
    const imageUrl = `http://localhost:9090${product.ruta_imagen}`;

    card.innerHTML = `
        <a href="#">
            <img class="p-8 rounded-t-lg object-cover h-64 w-full" src="${imageUrl}" alt="${product.nombre}" />
        </a>
        <div class="px-5 pb-5">
            <a href="#">
                <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">${product.nombre}</h5>
            </a>
            <div class="flex items-center justify-between mt-4">
                <span class="text-3xl font-bold text-gray-900 dark:text-white">$${product.precio}</span>
                <button class="add-to-cart-btn text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        data-product='${JSON.stringify(product)}'>
                    Añadir
                </button>
            </div>
        </div>
    `;
    return card;
}

async function handleAddToCart(event) {
    const button = event.target;
    const productData = JSON.parse(button.dataset.product);

    try {
        const response = await fetch(API_URL_CART, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // actualizar UI del carrito, por ahora solo avisamos
        console.log('Producto añadido al carrito:', productData.nombre);
        alert(`${productData.nombre} añadido al carrito.`);
        
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
        alert('Error al añadir producto. Intenta de nuevo.');
    }
}