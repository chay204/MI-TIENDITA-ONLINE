import express from 'express';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pathRouter = `${__dirname}/`;

const removeExtension = (fileName) => {
    return fileName.split('.').shift();
};

const loadRoutes = async () => {
    try {
        const files = fs.readdirSync(pathRouter);
        console.log('Archivos en el directorio:', files);

        for (const file of files) {
            const fileWithOutExt = removeExtension(file);
            const skip = ['index'].includes(fileWithOutExt);

            if (!skip) {
                try {
                    // Importar el módulo dinámicamente
                    const module = await import(`./${fileWithOutExt}.js`);
                    router.use(`/${fileWithOutExt}`, module.default);
                    console.log(`Ruta cargada: /${fileWithOutExt}`);
                } catch (err) {
                    console.error(`Error al cargar la ruta ${fileWithOutExt}:`, err);
                }
            }
        }
    } catch (err) {
        console.error('Error al leer el directorio de rutas:', err);
    }
};

// Llamar a la función para cargar las rutas
await loadRoutes();

router.use((req, res) => {
    res.status(404).json({ message: `Ruta ${req.originalUrl} no encontrada` });
});

export default router;
