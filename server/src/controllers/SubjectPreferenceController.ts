import { Request, Response } from "express";
import { prisma } from "../prismaClient";

const SubjectPreferenceController = {
  createSubjectPreference: async (req: Request, res: Response) => {
    const { subjectId, preferences } = req.body;

    // Validate request body
    if (!subjectId || !Array.isArray(preferences) || preferences.length !== 3) {
      return res.status(400).json({
        error:
          "Invalid request. Subject ID and exactly 3 preferences are required.",
      });
    }

    try {
      // Check if the subject exists
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
        include: {
          courses: true,
          buckets: true,
          category: true,
        },
      });

      if (!subject) {
        return res.status(404).json({ error: "Subject not found." });
      }

      // Extract valid course and bucket IDs for the subject
      const validCourseIds = subject.courses.map((course) => course.id);
      const validBucketIds = subject.buckets.map((bucket) => bucket.id);

      // Check the allotment type of the subject's category
      const { allotmentType } = subject.category;

      // Validate preferences based on allotment type
      for (const pref of preferences) {
        const { preferenceOrder, courseId, bucketId } = pref;

        if (
          !preferenceOrder ||
          (courseId && bucketId) ||
          (!courseId && !bucketId)
        ) {
          return res.status(400).json({
            error:
              "Each preference must have a preferenceOrder and either a courseId or a bucketId, but not both.",
          });
        }

        if (allotmentType === "STANDALONE") {
          if (!courseId || !validCourseIds.includes(courseId)) {
            return res.status(400).json({
              error: `Standalone subjects require a valid course ID. Invalid course ID: ${courseId}`,
            });
          }
          if (bucketId) {
            return res
              .status(400)
              .json({ error: "Standalone subjects do not accept bucket IDs." });
          }
        }

        if (allotmentType === "BUCKET") {
          if (!bucketId || !validBucketIds.includes(bucketId)) {
            return res.status(400).json({
              error: `Bucket subjects require a valid bucket ID. Invalid bucket ID: ${bucketId}`,
            });
          }
          if (courseId) {
            return res
              .status(400)
              .json({ error: "Bucket subjects do not accept course IDs." });
          }
        }
      }

      // Create subject preferences
      const createdPreferences = await prisma.subjectPreferences.createMany({
        data: preferences.map((pref) => ({
          subjectId,
          studentId: req.user.id, // Assuming you get the student ID from the authenticated request
          preferenceOrder: pref.preferenceOrder,
          courseId: pref.courseId || null,
          courseBucketId: pref.bucketId || null,
        })),
        skipDuplicates: true, // Avoid duplicates if already present
      });

      return res.status(201).json({
        message: "Preferences created successfully",
        createdPreferences,
      });
    } catch (error) {
      console.error("Error creating subject preferences:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  },
};

module.exports = SubjectPreferenceController;
