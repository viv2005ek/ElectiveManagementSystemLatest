import express from "express";
import ElectiveSectionController from "../controllers/ElectiveSectionController";

const router = express.Router();

// Get routes
// Fetch all professors
router.get("/professors", ElectiveSectionController.getProfessors);

// Fetch all courses for a subject
router.get(
  "/subject-courses/:subjectId",
  ElectiveSectionController.getSubjectCourses,
);

// Fetch all sections for a subject (across all courses)
router.get("/subject/:subjectId", ElectiveSectionController.getSubjectSections);

// Fetch all sections for a specific subject-course combination
router.get(
  "/subject-course/:subjectCourseWithSeatsId",
  ElectiveSectionController.getSubjectCourseSections,
);

// Fetch a section by ID with complete details
router.get("/:id", ElectiveSectionController.getSectionById);

// Mutation routes
// Create a new section
router.post("/", ElectiveSectionController.createSection);

// Update an existing section
router.put("/:id", ElectiveSectionController.updateSection);

// Delete a section
router.delete("/:id", ElectiveSectionController.deleteSection);

router.post(
  "/:subjectId/allot",
  ElectiveSectionController.allotStudentsToSections,
);

export default router;
