
import { Router } from 'express';
import { getStudentProfile, getAdminProfile } from '../controllers/profileController';

const router = Router();

/**
 * @swagger
 * /profile/student:
 *   get:
 *     summary: Get student profile
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Student profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     registrationNumber:
 *                       type: string
 *                     email:
 *                       type: string
 *                     personalInformation:
 *                       type: object
 *                       properties:
 *                         contactNumber:
 *                           type: string
 *                     academicInformation:
 *                       type: object
 *                       properties:
 *                         program:
 *                           type: string
 *                         semester:
 *                           type: string
 *                         batch:
 *                           type: string
 *                         department:
 *                           type: string
 *                         school:
 *                           type: string
 *                     contactInformation:
 *                       type: object
 *                       properties:
 *                         emailAddress:
 *                           type: string
 *                         registrationNumber:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student profile not found
 */
router.get('/student', getStudentProfile);

/**
 * @swagger
 * /profile/admin:
 *   get:
 *     summary: Get admin profile
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Admin profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     registrationNumber:
 *                       type: string
 *                     createdDate:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Admin profile not found
 */
router.get('/admin', getAdminProfile);

export default router;