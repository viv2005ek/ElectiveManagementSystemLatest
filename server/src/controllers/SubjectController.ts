import { Request, Response } from "express";
import { prisma } from "../prismaClient";

const SubjectController = {
    // Create a new subject
    async createSubject(req: Request, res: Response): Promise<any> {
        try {
            const { name, semester, batchId, subjectScope, subjectTypeId, programIds, courseIds, courseBucketIds } = req.body;

            // Validate required fields
            if (!name || !batchId || !subjectTypeId || !subjectScope) {
                return res.status(400).json({ error: "Missing required fields: name, batchId, subjectScope, or subjectTypeId" });
            }

            const subject = await prisma.subject.create({
                data: {
                    name,
                    semester,
                    subjectScope,
                    batch: { connect: { id: batchId } },
                    subjectType: { connect: { id: subjectTypeId } },
                    programs: programIds ? { connect: programIds.map((id: string) => ({ id })) } : undefined,
                    courses: courseIds ? { connect: courseIds.map((id: string) => ({ id })) } : undefined,
                    courseBuckets: courseBucketIds ? { connect: courseBucketIds.map((id: string) => ({ id })) } : undefined,
                },
            });

            res.status(201).json(subject);
        } catch (error) {
            console.error("Error creating subject:", error);
            res.status(500).json({ error: "Failed to create subject" });
        }
    },

    // Get all subjects with optional filtering and search
    async getAllSubjects(req: Request, res: Response): Promise<any> {
        try {
            const { search, subjectTypeId, semesterId, batchId, isAllotmentWindowOpen, isAllotmentFinalized } = req.query;

            const filters: any = {};
            if (subjectTypeId) filters.subjectTypeId = subjectTypeId;
            if (semesterId) filters.semesterId = semesterId;
            if (batchId) filters.batchId = batchId;
            if (isAllotmentWindowOpen !== undefined) filters.isAllotmentWindowOpen = isAllotmentWindowOpen === "true";
            if (isAllotmentFinalized !== undefined) filters.isAllotmentFinalized = isAllotmentFinalized === "true";

            const subjects = await prisma.subject.findMany({
                where: {
                    ...filters,
                    name: search ? { contains: search as string, mode: "insensitive" } : undefined,
                },
            });

            res.json(subjects);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch subjects" });
        }
    },

    // Get a single subject by ID
    async getSubjectById(req: Request, res: Response): Promise<any> {
        try {
            const subject = await prisma.subject.findUnique({
                where: { id: req.params.id },
            });
            if (!subject) return res.status(404).json({ error: "Subject not found" });
            res.json(subject);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch subject" });
        }
    },

    // Update a subject
    async updateSubject(req: Request, res: Response): Promise<any> {
        try {
            const subject = await prisma.subject.update({
                where: { id: req.params.id },
                data: req.body,
            });
            res.json(subject);
        } catch (error) {
            res.status(500).json({ error: "Failed to update subject" });
        }
    },

    // Delete a subject
    async deleteSubject(req: Request, res: Response): Promise<any> {
        try {
            await prisma.subject.delete({
                where: { id: req.params.id },
            });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Failed to delete subject" });
        }
    },
};

export default SubjectController;