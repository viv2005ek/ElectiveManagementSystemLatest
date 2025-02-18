import { Express } from 'express';
import AuthRoute from './AuthRoute';
import StudentRoute from './StudentRoute';
import DepartmentRoute from './DepartmentRoute';
import BranchRoute from './BranchRoute';
import CourseBucketRoute from './CourseBucketRoute';
import CourseRoute from './CourseRoute';
import CourseCategoryRoute from './CourseCategoryRoute';
import SubjectRoute from './SubjectRoute';
import authMiddleware from '../middleware/authMiddleware';

export const setupRoutes = (app: Express) => {
  app.use("/auth", AuthRoute);

  app.use(authMiddleware);
  app.use("/students", StudentRoute);
  app.use("/course-buckets", CourseBucketRoute);
  app.use("/departments", DepartmentRoute);
  app.use("/courses", CourseRoute);
  app.use("/branches", BranchRoute);
  app.use("/course-categories", CourseCategoryRoute);
  app.use("/subjects", SubjectRoute);
};
