import {Request, Response} from 'express'
const departmentController = {
  getAllDepartments: (req: Request, res: Response) => {
    return res.status(200).json({hello: 'hello'})
  }
}

export default departmentController
