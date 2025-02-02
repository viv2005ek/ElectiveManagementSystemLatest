import express from 'express'
import minorSpecializationController from '../controllers/MinorSpecializationController';

const router = express.Router()

router.get('/', minorSpecializationController.getAllMinorSpecializations)

router.get('/:id', minorSpecializationController.getMinorSpecializationById)


export default router
