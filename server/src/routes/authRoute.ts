import { loginController } from '../controllers/authController';
import express from 'express';

const router = express.Router()

router.post('/login',  loginController)

export default router
