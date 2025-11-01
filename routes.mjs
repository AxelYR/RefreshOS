import express from 'express';
import fs from 'fs';

//Helpers para leer/escribir archivos 
const readFileHelper = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') { // Archivo no encontrado
                    console.warn(`${filePath} no encontrado. Inicializando como [].`);
                    return resolve([]); // Devuelve array vacío
                }
                return reject(err);
            }
            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            } catch (error) {
                console.error(`Error al parsear JSON de ${filePath}:`, error);
                reject(new Error(`Error en formato JSON de ${filePath}`));
            }
        });
    });
};

const writeFileHelper = (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};

//Definicion de rutas 
function escucha(app) {
    const router = express.Router();
    app.use('/', router); // Montar el router en la raíz

    //  Rutas de productos (/data) 
    router.get('/data', async (req, res) => {
        console.log('Petición GET /data recibida');
        try {
            const datos = await readFileHelper('datos.txt');
            res.status(200).json(datos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    //  Rutas de Carrito (/cart) 
    router.get('/cart', async (req, res) => {
        console.log('Petición GET /cart recibida');
        try {
            const cart = await readFileHelper('carrito.txt');
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/cart', async (req, res) => {
        console.log('Petición POST /cart recibida');
        const productToAdd = req.body;
        if (!productToAdd || !productToAdd.id) {
            return res.status(400).json({ error: 'Producto inválido' });
        }

        try {
            let cart = await readFileHelper('carrito.txt');
            const index = cart.findIndex(item => item.id === productToAdd.id);

            if (index > -1) {
                cart[index].cantidad = (cart[index].cantidad || 1) + 1;
            } else {
                cart.push({ ...productToAdd, cantidad: 1 });
            }
            
            await writeFileHelper('carrito.txt', cart);
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.delete('/cart/:id', async (req, res) => {
        const { id } = req.params;
        console.log(`Petición DELETE /cart/${id}`);
        try {
            let cart = await readFileHelper('carrito.txt');
            const newCart = cart.filter(item => item.id !== id);

            if (cart.length === newCart.length) {
                return res.status(404).json({ error: 'Producto no encontrado en carrito' });
            }

            await writeFileHelper('carrito.txt', newCart);
            res.status(200).json({ message: 'Producto eliminado', cart: newCart });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    //  Ruta de Órdenes (/order) 
    router.post('/order', async (req, res) => {
        console.log('Petición POST /order recibida');
        const orderData = req.body;
        if (!orderData || !orderData.customerInfo || !orderData.cartItems) {
            return res.status(400).json({ error: 'Datos de orden incompletos' });
        }

        try {
            let orders = await readFileHelper('ordenes.txt');
            const newOrder = {
                orderId: Date.now().toString(),
                timestamp: new Date().toISOString(),
                ...orderData
            };
            
            orders.push(newOrder);
            await writeFileHelper('ordenes.txt', orders);

            // Vaciar carrito
            await writeFileHelper('carrito.txt', []);

            res.status(201).json({ message: 'Orden creada', orderId: newOrder.orderId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}

export default escucha;