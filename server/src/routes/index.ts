import { Router } from "express";
import AuthRoute from "./AuthRoute";
import StudentRoute from "./StudentRoute";
import DepartmentRoute from "./DepartmentRoute";
import authMiddleware from "../middleware/authMiddleware";
import FacultyRoute from "./FacultyRoute";
import SchoolRoute from "./SchoolRoute";
import EnumsRoute from "./EnumsRoute";
import ProgramRoute from "./ProgramRoute";
import BatchRoute from "./BatchRoute";
import SemesterRoute from "./SemesterRoute";
import SubjectTypeRoute from "./SubjectTypeRoute";
import CourseBucketRoute from "./CourseBucketRoute";
import CourseRoute from "./CourseRoute";
import SubjectRoute from "./SubjectRoute";
import SubjectPreferenceRoute from "./SubjectPreferenceRoute";
import ElectiveSectionRoute from "./ElectiveSectionRoute";

export const setupRoutes = (app: Router) => {
  app.use("/auth", AuthRoute);

  app.use(authMiddleware);
  app.use("/faculties", FacultyRoute);
  app.use("/schools", SchoolRoute);
  app.use("/departments", DepartmentRoute);
  app.use("/programs", ProgramRoute);
  app.use("/batches", BatchRoute);
  app.use("/semesters", SemesterRoute);
  app.use("/students", StudentRoute);
  app.use("/courses", CourseRoute);
  app.use("/course-buckets", CourseBucketRoute);
  app.use("/subjects", SubjectRoute);
  app.use("/subject-types", SubjectTypeRoute);
  app.use("/subject-preferences", SubjectPreferenceRoute);
  app.use("/enums", EnumsRoute);
  app.use("/elective-sections", ElectiveSectionRoute);
};
