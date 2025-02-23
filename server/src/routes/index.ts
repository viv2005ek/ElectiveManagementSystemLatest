import { Express } from 'express';
import AuthRoute from './AuthRoute';
import StudentRoute from './StudentRoute';
import DepartmentRoute from './DepartmentRoute';
import authMiddleware from '../middleware/authMiddleware';
import FacultyRoute from './FacultyRoute';
import SchoolRoute from './SchoolRoute';
import EnumsRoute from './EnumsRoute';
import ProgramRoute from './ProgramRoute';
import BatchRoute from './BatchRoute';
import SemesterRoute from './SemesterRoute';

export const setupRoutes = (app: Express) => {
  app.use("/auth", AuthRoute);

  app.use(authMiddleware);
  // app.use("/course-buckets", CourseBucketRoute);
  // app.use("/courses", CourseRoute);
  // app.use("/branches", BranchRoute);
  // app.use("/course-categories", CourseCategoryRoute);
  // app.use("/subjects", SubjectRoute);
  app.use("/students", StudentRoute);
  app.use("/departments", DepartmentRoute);
  app.use("/faculties", FacultyRoute);
  app.use("/schools", SchoolRoute);
  app.use("/enums", EnumsRoute);
  app.use("/programs", ProgramRoute);
  app.use("/batches", BatchRoute);
  app.use("/semesters", SemesterRoute);
};
