import express from 'express'
import minorSpecializationController from '../controllers/MinorSpecializationController';

const router = express.Router()

router.get('/', minorSpecializationController.getAllMinorSpecializations)


export default router
