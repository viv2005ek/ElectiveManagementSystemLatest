import {Router} from 'express';
import studentController from '../controllers/StudentController';
import verifyAdmin from '../middleware/authMiddleware';
import minorSpecializationController from '../controllers/MinorSpecializationController';
import programmeElectiveController from '../controllers/ProgrammeElectiveController';

const router = Router()

router.use(verifyAdmin)


router.get('/minor-specializations', minorSpecializationController.getAllMinorSpecializations)

router.get('/programme-electives', programmeElectiveController.getAllProgrammeElectives)

router.get('/students', studentController.getAllStudents)


export default router
