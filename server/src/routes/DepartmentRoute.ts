import express from 'express'
import departmentController from '../controllers/DepartmentController';

const router = express.Router()

router.get('/', departmentController.getAllDepartments)

router.get('/:id', departmentController.getDepartmentById)


export default router
