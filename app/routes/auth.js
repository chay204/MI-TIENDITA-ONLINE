import express from 'express';
const router = express.Router();

import { loginCtrl, registerCtrl } from '../controllers/auth.js';  

//ruta para login
router.post('/login', loginCtrl);
//ruta registrar usuario
router.post('/register', registerCtrl);

export default router;