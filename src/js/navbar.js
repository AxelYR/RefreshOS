export function loadNavbar() {
  const navbarHTML = `
      <!-- NAVBAR -->
  <header>
    <nav class="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/media/LogoTrasnparente.webp" class="h-8 rounded-full" alt="RefreshOS Logo" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">RefreshOS</span>
        </a>

        <!-- Botón menú móvil -->
        <button data-collapse-toggle="navbar-solid-bg" type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-solid-bg" aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>

        <!-- Links -->
        <div class="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
          <ul
            class="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li>
              <a href="./index.html"
                class="block py-2 px-3 md:p-0 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent">Inicio</a>
            </li>
            <li>
              <a href="./compras.html"
                class="block py-2 px-3 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">Tienda</a>
            </li>
            <li>
              <a href="./acercaDe.html"
                class="block py-2 px-3 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">Acerca
                de</a>
            </li>
            <a href="./misPedidos.html"
              class="block py-2 px-3 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">Mis
              pedidos
            </a>
            </li>
            <!-- Login -->
            <li>
              <a href="./login.html"
                class="block py-2 px-3 md:p-0 hover:bg-gray-100 md:hover:bg-transparent dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd"
                    d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                    clip-rule="evenodd" />
                </svg>
              </a>
            </li>
            <!-- Finalizar compra -->
            <li>
              <a href="./finalizarCompra.html"
                class="block py-2 px-3 md:p-0 hover:bg-gray-100 md:hover:bg-transparent dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd"
                    d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z"
                    clip-rule="evenodd" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  `;
  document.getElementById("nav-placeholder").innerHTML = navbarHTML;
}
