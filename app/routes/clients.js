import express from 'express';
import { getItems, createItem, updateItem, deleteItem } from '../controllers/clients.js';
const router = express.Router();


// Rutas para obtener, crear, actualizar y eliminar clientes
router.get('/', getItems);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;