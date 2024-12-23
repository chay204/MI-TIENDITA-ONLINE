import express from 'express';
import { getAllOrders, getOrder, createOrder, updateOrder, deleteOrder } from '../controllers/order.js';

const router = express.Router();

// Rutas para obtener, crear, actualizar y eliminar ordenes
router.get('/', getAllOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);



export default router;