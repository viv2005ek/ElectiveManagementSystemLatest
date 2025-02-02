import {Router} from 'express'
import authController from '../controllers/authController';
const  router = Router()

router.post('/login', authController.loginController)

router.post('/register', authController.registerController)

// router.post('/admin/logout', authController.logoutController)

export default router
