import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { hash } from "bcrypt";
import { UserRole } from "@prisma/client";

const ProfessorController = {
  // Get all professors (excluding deleted ones)
  getAllProfessors: async (req: Request, res: Response): Promise<any> => {
    try {
      const {
        departmentId,
        search,
        page = 1,
        pageSize = 10,
      } = req.query;

      // Build the where condition dynamically
      const where: any = { isDeleted: false };

      if (departmentId) {
        where.departmentId = String(departmentId);
      }

      // Search functionality
      if (typeof search === "string" && search.trim() !== "") {
        where.OR = [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { registrationNumber: { contains: search, mode: "insensitive" } },
        ];
      }

      // Get total count of filtered professors
      const totalProfessors = await prisma.professor.count({ where });
      const totalPages = Math.ceil(totalProfessors / Number(pageSize));

      // Apply pagination AFTER filtering
      const professors = await prisma.professor.findMany({
        where,
        include: {
          department: {
            select: {
              id: true,
              name: true,
              school: { select: { id: true, name: true } },
            },
          },
          professorRank: {
            select: {
              id: true,
              name: true,
              priority: true,
            },
          },
        },
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        orderBy: { firstName: "asc" },
      });

      res.status(200).json({
        professors,
        totalPages,
        currentPage: Number(page),
        pageSize: Number(pageSize),
      });
    } catch (error) {
      console.error("Error fetching professors:", error);
      res.status(500).json({ message: "Unable to fetch professors" });
    }
  },

  // Get a professor by ID
  getProfessorById: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
      const professor = await prisma.professor.findUnique({
        where: { id },
        include: {
          department: {
            select: {
              id: true,
              name: true,
              school: { select: { id: true, name: true } },
            },
          },
          professorRank: {
            select: {
              id: true,
              name: true,
              priority: true,
            },
          },
        },
      });

      if (!professor || professor.isDeleted) {
        return res.status(404).json({ message: "Professor not found" });
      }

      res.status(200).json(professor);
    } catch (error) {
      console.error("Error fetching professor:", error);
      res.status(500).json({ message: "Unable to fetch professor" });
    }
  },

  // Create a new professor
  createProfessor: async (req: Request, res: Response): Promise<any> => {
    const {
      firstName,
      middleName,
      lastName,
      email,
      registrationNumber,
      departmentId,
      professorRankId,
      password,
    } = req.body;

    if (!firstName || !lastName || !email || !registrationNumber || !departmentId || !professorRankId || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      // Check if professor already exists
      const existingProfessor = await prisma.professor.findFirst({
        where: {
          OR: [
            { email },
            { registrationNumber },
          ],
        },
      });

      if (existingProfessor) {
        return res.status(400).json({ 
          message: "Professor with this email or registration number already exists" 
        });
      }

      // Hash password
      const hashedPassword = await hash(password, 10);

      // Create professor with credential in transaction
      const professor = await prisma.$transaction(async (tx) => {
        const credential = await tx.credential.create({
          data: {
            email,
            passwordHash: hashedPassword,
            role: UserRole.Professor,
          },
        });

        return await tx.professor.create({
          data: {
            firstName,
            middleName,
            lastName,
            email,
            registrationNumber,
            departmentId,
            professorRankId,
            credentialId: credential.id,
          },
          include: {
            department: true,
            professorRank: true,
          },
        });
      });

      res.status(201).json({
        message: "Professor created successfully",
        professor,
      });
    } catch (error) {
      console.error("Error creating professor:", error);
      res.status(500).json({ message: "Unable to create professor" });
    }
  },

  // Update a professor
  updateProfessor: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const {
      firstName,
      middleName,
      lastName,
      email,
      departmentId,
      professorRankId,
    } = req.body;

    try {
      const professor = await prisma.professor.findUnique({ where: { id } });

      if (!professor || professor.isDeleted) {
        return res.status(404).json({ message: "Professor not found" });
      }

      const updatedProfessor = await prisma.professor.update({
        where: { id },
        data: {
          firstName,
          middleName,
          lastName,
          email,
          departmentId,
          professorRankId,
        },
        include: {
          department: true,
          professorRank: true,
        },
      });

      res.status(200).json({
        message: "Professor updated successfully",
        professor: updatedProfessor,
      });
    } catch (error) {
      console.error("Error updating professor:", error);
      res.status(500).json({ message: "Unable to update professor" });
    }
  },

  // Soft delete a professor
  deleteProfessor: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
      const professor = await prisma.professor.findUnique({ where: { id } });

      if (!professor || professor.isDeleted) {
        return res.status(404).json({ message: "Professor not found" });
      }

      await prisma.professor.update({
        where: { id },
        data: { isDeleted: true },
      });

      res.status(200).json({ message: "Professor deleted successfully" });
    } catch (error) {
      console.error("Error deleting professor:", error);
      res.status(500).json({ message: "Unable to delete professor" });
    }
  },
};

export default ProfessorController;