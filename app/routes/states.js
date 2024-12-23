import express from 'express';
import { getStates, createState, updateState, deleteState } from '../controllers/states.js';
const router = express.Router();


// Rutas para obtener, crear, actualizar y eliminar estados
router.get('/', getStates);
router.post('/', createState);
router.put('/:id', updateState);
router.delete('/:id', deleteState);

export default router;