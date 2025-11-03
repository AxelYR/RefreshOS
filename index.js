import dotenv from 'dotenv';
dotenv.config(); // carga la variable del archivo .env
import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
import escucha from './routes.mjs'; 

const app = express();
app.use(bodyparser.json());
app.use(cors());

// Para los JS, CSS, HTML (src/js, src/css, src/html)
app.use(express.static('src')); 

// Para las imagenes del front (media/carrusel, media/Logo)
app.use(express.static('media'));

// Para las imagenes de productos 
app.use(express.static('public'));

// --- Carga de la API ---
escucha(app); // Carga rutas (GET /data, POST /cart, etc.)

app.listen('9090', function(){
    console.log('Servidor escuchando en http://localhost:9090');
    console.log('---');
    console.log('Tu página de inicio está en: http://localhost:9090/html/index.html');
    console.log('Tu tienda está en: http://localhost:9090/html/compras.html');
});
