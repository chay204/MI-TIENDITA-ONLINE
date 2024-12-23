import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct} from '../controllers/products.js';

const router = express.Router();

// Rutas para obtener, crear, actualizar y eliminar productos
router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);



export default router;