import express from 'express';
import { getItems, createItem, updateItem, deleteItem } from '../controllers/users.js';
import {checkRoleAuth} from '../middleware/roleAuth.js'
import checkAuth from '../middleware/auth.js'
const router = express.Router();

// Rutas para obtener, crear, actualizar y eliminar usuarios
router.get('/', checkAuth, checkRoleAuth(['Administrador']),getItems);
router.post('/', checkRoleAuth(['Administrador']), createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);



export default router;
