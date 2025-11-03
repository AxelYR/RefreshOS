import express from 'express';
import fs from 'fs';
import { Resend } from 'resend';

// Helpers para leer/escribir archivos (sin cambios)
const readFileHelper = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.warn(`${filePath} no encontrado. Inicializando como [].`);
                    return resolve([]);
                }
                return reject(err);
            }
            if (data === '') {
                console.warn(`${filePath} está vacío. Inicializando como [].`);
                return resolve([]);
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

// Definicion de rutas
function escucha(app) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const router = express.Router();
    app.use('/', router);

    // Rutas de Productos 
    router.get('/data', async (req, res) => {
        console.log('Petición GET /data recibida');
        try {
            const datos = await readFileHelper('datos.txt');
            res.status(200).json(datos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Rutas de Carrito 
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

    // ruta de ordenes
    router.post('/order', async (req, res) => {
        console.log('Petición POST /order recibida');
        const orderData = req.body;
        if (!orderData || !orderData.customerInfo || !orderData.cartItems) {
            return res.status(400).json({ error: 'Datos de orden incompletos' });
        }

        const customerEmail = orderData.customerInfo.email;
        const newOrderId = Date.now().toString();

        try {
            // guardar la orden en ordenes.txt
            let orders = await readFileHelper('ordenes.txt');
            const newOrder = {
                orderId: newOrderId,
                timestamp: new Date().toISOString(),
                ...orderData
            };
            
            orders.push(newOrder);
            await writeFileHelper('ordenes.txt', orders);

            // Vaciar carrito.txt
            await writeFileHelper('carrito.txt', []);

            // enviar correo de confirmación con Resend
            try {
                const emailContent = `
                    ¡Bienvenido, gracias por su compra!
                    <br><br>
                    Para procesar el pedido, por favor haga un depósito a la cuenta:
                    <br>
                    <strong>Cuenta CLABE:</strong> xxxx-xxxx-xxxx-xxxx
                    <br>
                    <strong>Destinatario:</strong> Carlitos Gutierrez
                    <br><br>
                    En el concepto, por favor añada su número de compra:
                    <br>
                    <strong>Número de Compra: ${newOrderId}</strong>
                    <br><br>
                    Mande una captura de pantalla de la transferencia a este mismo correo (xarekyeah@gmail.com) y será atendido inmediatamente.
                    <br><br>
                    ¡Gracias!
                `;

                const { data, error } = await resend.emails.send({
                    from: 'RefreshOS <onboarding@resend.dev>', // (Resend usa 'onboarding@resend.dev' para dominios no verificados)
                    to: [customerEmail], // el correo del cliente
                    bcc: ['xarekyeah@gmail.com'],
                    subject: `Confirmación de Pedido RefreshOS: #${newOrderId}`,
                    html: emailContent
                });

                if (error) {
                    console.error('Error al enviar correo con Resend:', error);
                    // no se detiene la orden, solo registra el error
                } else {
                    console.log('Correo de confirmación enviado:', data.id);
                }

            } catch (emailError) {
                console.error('Excepción al enviar correo:', emailError);
            }

            // Responder al frontend
            res.status(201).json({ message: 'Orden creada y correo enviado', orderId: newOrder.orderId });

        } catch (error) {
            console.error('Error al procesar la orden:', error);
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/my-orders', async (req, res) => {
        console.log('Petición GET /my-orders recibida');
        
        //obtener el email del usuario desde una query
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Falta el email del usuario' });
        }

        try {
            // Leer TODAS las ordenes
            const allOrders = await readFileHelper('ordenes.txt');
            
            // Filtrar solo las ordenes que coincidan con el email
            const userOrders = allOrders.filter(order => 
                order.customerInfo && order.customerInfo.email === email
            );
            
            //Devolveo solo las ordenes de ESE usuario
            res.status(200).json(userOrders);

        } catch (error) {
            console.error('Error al obtener mis pedidos:', error);
            res.status(500).json({ error: 'Error interno al buscar pedidos.' });
        }
    });

    // Rutas de Autenticación 
    router.post('/register', async (req, res) => {
        console.log('Petición POST /register recibida');
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
        }
        try {
            let users = await readFileHelper('usuarios.txt');
            const userExists = users.find(user => user.email === email);
            if (userExists) {
                return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
            }
            const newUser = { id: Date.now().toString(), email, password };
            users.push(newUser);
            await writeFileHelper('usuarios.txt', users);
            res.status(201).json({ message: 'Usuario registrado', userId: newUser.id });
        } catch (error) {
            res.status(500).json({ error: 'Error interno.' });
        }
    });

    router.post('/login', async (req, res) => {
        console.log('Petición POST /login recibida');
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
        }
        try {
            let users = await readFileHelper('usuarios.txt');
            const user = users.find(u => u.email === email);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }
            if (user.password !== password) {
                return res.status(401).json({ error: 'Contraseña incorrecta.' });
            }
            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                user: { id: user.id, email: user.email }
            });
        } catch (error) {
            res.status(500).json({ error: 'Error interno.' });
        }
    });
}

export default escucha;