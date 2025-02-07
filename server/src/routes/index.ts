import { Express } from "express";
import AuthRoute from "./AuthRoute";
import StudentRoute from "./StudentRoute";
import MinorSpecializationRoute from "./MinorSpecializationRoute";
import DepartmentRoute from "./DepartmentRoute";
import ProgrammeElectiveRoute from "./ProgrammeElectiveRoute";
import BranchRoute from "./BranchRoute";

export const setupRoutes = (app: Express) => {
  app.use("/auth", AuthRoute);
  app.use("/students", StudentRoute);
  app.use("/minor-specializations", MinorSpecializationRoute);
  app.use("/departments", DepartmentRoute);
  app.use("/programme-electives", ProgrammeElectiveRoute);
  app.use("/branches", BranchRoute);
};
