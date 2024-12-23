import express from 'express';
import { getAllCategories, createCategories, updateCategories, deleteCategories } from '../controllers/categories.js';
const router = express.Router();


// Rutas para obtener, crear, actualizar y eliminar categorias
router.get('/', getAllCategories);
router.post('/', createCategories);
router.put('/:id', updateCategories);
router.delete('/:id', deleteCategories);

export default router;