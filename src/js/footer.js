export function loadFooter() {
    const footerHTML = `
  <!-- FOOTER -->
  <footer class="bg-white dark:bg-gray-800 w-full px-4 md:px-8 py-6">
    <div class="max-w-screen-xl mx-auto">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="mb-6 md:mb-0">
          <div class="flex items-center">
            <img src="/media/LogoTrasnparente.webp" class="mr-3 h-8 rounded-full" alt="Logo" />
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">RefreshOS</span>
          </div>
          <!-- Redes sociales -->

          <div class="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
            <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <!-- Facebook -->
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <!-- Instagram -->
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm.685 5.067a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27z"
                  clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        <div class="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
          <div>
            <p class="text-gray-700 dark:text-white">“Bebidas por lote,</p>
            <p class="text-gray-700 dark:text-white">éxito por mayoreo.”</p>
          </div>

        </div>
        <!-- Informacion del footer -->
        <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
          <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Compañia</h2>
            <ul class="text-gray-600 dark:text-gray-400">
              <li class="mb-4">
                <a class="hover:underline">Acerca de</a>
              </li>
              <li>
                <a class="hover:underline">Nuestro Equipo</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Soporte</h2>
            <ul class="text-gray-600 dark:text-gray-400">
              <li class="mb-4">
                <a class="hover:underline ">RefreshOS@gmail.com</a>
              </li>
              <li>
                <a class="hover:underline">+52 33 xxxx-xxxx</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
            <ul class="text-gray-600 dark:text-gray-400">
              <li class="mb-4">
                <a href="#" class="hover:underline">Privacy Policy</a>
              </li>
              <li>
                <a href="#" class="hover:underline">Terms &amp; Conditions</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

      <div class="sm:flex sm:items-center sm:justify-between">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025
          <a href="#" class="hover:underline">RefreshOS</a>. All Rights Reserved.
        </span>
      </div>
    </div>
  </footer>
    `;
    document.getElementById("footer-placeholder").innerHTML = footerHTML;
}
