import {Router} from 'express'
import authController from '../controllers/authController';
const  router = Router()

router.post('/admin/login', authController.adminLoginController)

// router.post('/admin/logout', authController.logoutController)

export default router
