import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import routes from './app/routes/index.js';  // Asegúrate de que esta importación es correcta
import { dbConnect } from './config/db.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Usar las rutas con el prefijo '/api/'
app.use('/api', routes);
// Agregar un log para verificar si las rutas están siendo importadas correctamente
console.log('Rutas cargadas desde:', routes);
// Verificar si las rutas se están cargando
app.listen(PORT, () => {
    console.log('API lista por el puerto', PORT);

    // Imprimir todas las rutas cargadas
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            console.log(`Ruta: ${middleware.route.path}, Métodos: ${Object.keys(middleware.route.methods).join(', ')}`);
        }
    });
});

dbConnect();