import express from 'express';
import { getRoles, createRol, updateRol, deleteRol } from '../controllers/roles.js';
const router = express.Router();


// Rutas para obtener, crear, actualizar y eliminar roles
router.get('/', getRoles);
router.post('/', createRol);
router.put('/:id', updateRol);
router.delete('/:id', deleteRol);

export default router;