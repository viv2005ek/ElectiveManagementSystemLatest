import { Express } from 'express';
import AuthRoute from './AuthRoute';
import StudentRoute from './StudentRoute';
import DepartmentRoute from './DepartmentRoute';
import BranchRoute from './BranchRoute';
import CourseBucketRoute from './CourseBucketRoute';
import CourseRoute from './CourseRoute';

export const setupRoutes = (app: Express) => {
  app.use("/auth", AuthRoute);
  app.use("/students", StudentRoute);
  app.use("/course-buckets", CourseBucketRoute);
  app.use("/departments", DepartmentRoute);
  app.use("/courses", CourseRoute);
  app.use("/branches", BranchRoute);
};
