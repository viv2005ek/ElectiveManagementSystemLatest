import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { hash } from "bcrypt";
import { UserRole } from "@prisma/client";

interface BulkProfessorData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  departmentId: string;
  professorRankId: string;
}

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

  // Validation
  const validationErrors: Array<{ field: string; message: string }> = [];

  if (!firstName) validationErrors.push({ field: "firstName", message: "First name is required" });
  if (!lastName) validationErrors.push({ field: "lastName", message: "Last name is required" });
  if (!email) validationErrors.push({ field: "email", message: "Email is required" });
  if (!registrationNumber) validationErrors.push({ field: "registrationNumber", message: "Registration number is required" });
  if (!departmentId) validationErrors.push({ field: "departmentId", message: "Department ID is required" });
  if (!professorRankId) validationErrors.push({ field: "professorRankId", message: "Professor rank ID is required" });
  if (!password) validationErrors.push({ field: "password", message: "Password is required" });

  if (validationErrors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      summary: {
        totalProcessed: 1,
        successCount: 0,
        failedCount: 1
      },
      successful: [],
      failed: [{
        email: email || 'Unknown',
        registrationNumber: registrationNumber || 'Unknown',
        error: `Validation errors: ${validationErrors.map(e => e.message).join(', ')}`
      }]
    });
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
        message: "Professor creation failed",
        summary: {
          totalProcessed: 1,
          successCount: 0,
          failedCount: 1
        },
        successful: [],
        failed: [{
          email,
          registrationNumber,
          error: "Professor with this email or registration number already exists"
        }]
      });
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    });

    if (!department) {
      return res.status(400).json({
        message: "Professor creation failed",
        summary: {
          totalProcessed: 1,
          successCount: 0,
          failedCount: 1
        },
        successful: [],
        failed: [{
          email,
          registrationNumber,
          error: `Department with ID ${departmentId} not found`
        }]
      });
    }

    // Check if professor rank exists
    const professorRank = await prisma.professorRank.findUnique({
      where: { id: professorRankId }
    });

    if (!professorRank) {
      return res.status(400).json({
        message: "Professor creation failed",
        summary: {
          totalProcessed: 1,
          successCount: 0,
          failedCount: 1
        },
        successful: [],
        failed: [{
          email,
          registrationNumber,
          error: `Professor rank with ID ${professorRankId} not found`
        }]
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

    // Success response matching bulk format
    res.status(201).json({
      message: "Professor created successfully",
      summary: {
        totalProcessed: 1,
        successCount: 1,
        failedCount: 0
      },
      successful: [{
        id: professor.id,
        email: professor.email,
        registrationNumber: professor.registrationNumber,
        firstName: professor.firstName,
        lastName: professor.lastName || '',
        middleName: professor.middleName || undefined,
        departmentId: professor.departmentId,
        professorRankId: professor.professorRankId,
        message: "Professor created successfully"
      }],
      failed: []
    });

  } catch (error) {
    console.error("Error creating professor:", error);
    
    let errorMessage = "Failed to create professor due to system error";
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        errorMessage = "Professor with this email or registration number already exists";
      } else {
        errorMessage = error.message;
      }
    }

    res.status(500).json({
      message: "Professor creation failed",
      summary: {
        totalProcessed: 1,
        successCount: 0,
        failedCount: 1
      },
      successful: [],
      failed: [{
        email,
        registrationNumber,
        error: errorMessage
      }]
    });
  }
},

  // Bulk create professors
  bulkCreateProfessors: async (req: Request, res: Response): Promise<any> => {
    const { professors } = req.body;

    if (!Array.isArray(professors) || professors.length === 0) {
      return res.status(400).json({ 
        message: "Professors array is required and cannot be empty" 
      });
    }

    // Validate each professor data
    const validationErrors: Array<{
      email: string;
      registrationNumber: string;
      error: string;
      index: number;
    }> = [];

    professors.forEach((prof: BulkProfessorData, index: number) => {
      if (!prof.firstName) {
        validationErrors.push({
          email: prof.email || 'Unknown',
          registrationNumber: prof.registrationNumber || 'Unknown',
          error: "First name is required",
          index
        });
      }
      if (!prof.lastName) {
        validationErrors.push({
          email: prof.email || 'Unknown',
          registrationNumber: prof.registrationNumber || 'Unknown',
          error: "Last name is required",
          index
        });
      }
      if (!prof.email) {
        validationErrors.push({
          email: 'Unknown',
          registrationNumber: prof.registrationNumber || 'Unknown',
          error: "Email is required",
          index
        });
      }
      if (!prof.registrationNumber) {
        validationErrors.push({
          email: prof.email || 'Unknown',
          registrationNumber: 'Unknown',
          error: "Registration number is required",
          index
        });
      }
      if (!prof.departmentId) {
        validationErrors.push({
          email: prof.email || 'Unknown',
          registrationNumber: prof.registrationNumber || 'Unknown',
          error: "Department ID is required",
          index
        });
      }
      if (!prof.professorRankId) {
        validationErrors.push({
          email: prof.email || 'Unknown',
          registrationNumber: prof.registrationNumber || 'Unknown',
          error: "Professor rank ID is required",
          index
        });
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed for some professors",
        summary: {
          totalProcessed: 0,
          successCount: 0,
          failedCount: validationErrors.length
        },
        successful: [],
        failed: validationErrors
      });
    }

    try {
      // Check for existing professors to avoid duplicates
      const emails = professors.map(p => p.email);
      const registrationNumbers = professors.map(p => p.registrationNumber);

      const existingProfessors = await prisma.professor.findMany({
        where: {
          OR: [
            { email: { in: emails } },
            { registrationNumber: { in: registrationNumbers } }
          ]
        },
        select: {
          email: true,
          registrationNumber: true
        }
      });

      const existingEmails = new Set(existingProfessors.map(p => p.email));
      const existingRegistrationNumbers = new Set(existingProfessors.map(p => p.registrationNumber));

      const results = {
        successful: [] as Array<{
          id: string;
          email: string;
          registrationNumber: string;
          firstName: string;
          lastName: string;
          middleName?: string;
          departmentId: string;
          professorRankId: string;
          defaultPassword: string;
          message: string;
        }>,
        failed: [] as Array<{
          email: string;
          registrationNumber: string;
          error: string;
          index?: number;
        }>
      };

      // First pass: Check for duplicates and add to failed list
      professors.forEach((professorData: BulkProfessorData, index: number) => {
        if (existingEmails.has(professorData.email)) {
          results.failed.push({
            email: professorData.email,
            registrationNumber: professorData.registrationNumber,
            error: "Email already exists in system",
            index
          });
          return;
        }

        if (existingRegistrationNumbers.has(professorData.registrationNumber)) {
          results.failed.push({
            email: professorData.email,
            registrationNumber: professorData.registrationNumber,
            error: "Registration number already exists in system",
            index
          });
          return;
        }

        // Check for duplicates within the same batch
        const duplicateInBatch = professors.slice(0, index).some((p, i) => 
          p.email === professorData.email || p.registrationNumber === professorData.registrationNumber
        );

        if (duplicateInBatch) {
          results.failed.push({
            email: professorData.email,
            registrationNumber: professorData.registrationNumber,
            error: "Duplicate email or registration number within the batch",
            index
          });
          return;
        }

        // Add to existing sets to track duplicates in current batch
        existingEmails.add(professorData.email);
        existingRegistrationNumbers.add(professorData.registrationNumber);
      });

      // Filter out professors that failed duplicate checks
      const professorsToProcess = professors.filter((prof, index) => 
        !results.failed.some(failed => failed.index === index)
      );

      // Process remaining professors in batches
      const BATCH_SIZE = 10;
      
      for (let i = 0; i < professorsToProcess.length; i += BATCH_SIZE) {
        const batch = professorsToProcess.slice(i, i + BATCH_SIZE);
        
        await Promise.all(
          batch.map(async (professorData: BulkProfessorData) => {
            try {
              // Generate a default password (first name + last 4 of registration number)
              const defaultPassword = `${professorData.firstName.toLowerCase()}${professorData.registrationNumber.slice(-4)}`;
              const hashedPassword = await hash(defaultPassword, 10);

              // Create professor in transaction
              await prisma.$transaction(async (tx) => {
                // Check if department exists
                const department = await tx.department.findUnique({
                  where: { id: professorData.departmentId }
                });

                if (!department) {
                  throw new Error(`Department with ID ${professorData.departmentId} not found`);
                }

                // Check if professor rank exists
                const professorRank = await tx.professorRank.findUnique({
                  where: { id: professorData.professorRankId }
                });

                if (!professorRank) {
                  throw new Error(`Professor rank with ID ${professorData.professorRankId} not found`);
                }

                const credential = await tx.credential.create({
                  data: {
                    email: professorData.email,
                    passwordHash: hashedPassword,
                    role: UserRole.Professor,
                  },
                });

                const professor = await tx.professor.create({
                  data: {
                    firstName: professorData.firstName,
                    middleName: professorData.middleName,
                    lastName: professorData.lastName,
                    email: professorData.email,
                    registrationNumber: professorData.registrationNumber,
                    departmentId: professorData.departmentId,
                    professorRankId: professorData.professorRankId,
                    credentialId: credential.id,
                  },
                  include: {
                    department: true,
                    professorRank: true,
                  },
                });

                // Fix: Handle nullable fields properly
                results.successful.push({
                  id: professor.id,
                  email: professor.email,
                  registrationNumber: professor.registrationNumber,
                  firstName: professor.firstName,
                  lastName: professor.lastName || '', // Handle null case
                  middleName: professor.middleName || undefined, // Handle null case
                  departmentId: professor.departmentId,
                  professorRankId: professor.professorRankId,
                  defaultPassword: defaultPassword,
                  message: "Professor created successfully"
                });
              });

            } catch (error) {
              console.error(`Error creating professor ${professorData.email}:`, error);
              
              let errorMessage = "Failed to create professor";
              if (error instanceof Error) {
                if (error.message.includes('Department')) {
                  errorMessage = `Department not found: ${professorData.departmentId}`;
                } else if (error.message.includes('Professor rank')) {
                  errorMessage = `Professor rank not found: ${professorData.professorRankId}`;
                } else if (error.message.includes('Unique constraint')) {
                  errorMessage = "Duplicate email or registration number (race condition)";
                } else {
                  errorMessage = error.message;
                }
              }

              results.failed.push({
                email: professorData.email,
                registrationNumber: professorData.registrationNumber,
                error: errorMessage
              });
            }
          })
        );
      }

      // Prepare final response
      const successCount = results.successful.length;
      const failedCount = results.failed.length;
      const totalProcessed = successCount + failedCount;

      let finalMessage = "";
      if (successCount === totalProcessed) {
        finalMessage = "All professors created successfully";
      } else if (failedCount === totalProcessed) {
        finalMessage = "All professors failed to create";
      } else {
        finalMessage = `Bulk operation completed with ${successCount} successful and ${failedCount} failed`;
      }

      res.status(201).json({
        message: finalMessage,
        summary: {
          totalProcessed,
          successCount,
          failedCount
        },
        successful: results.successful,
        failed: results.failed
      });

    } catch (error) {
      console.error("Error in bulk professor creation:", error);
      res.status(500).json({ 
        message: "Unable to process bulk professor creation",
        summary: {
          totalProcessed: 0,
          successCount: 0,
          failedCount: professors.length
        },
        successful: [],
        failed: professors.map(prof => ({
          email: prof.email,
          registrationNumber: prof.registrationNumber,
          error: "System error during bulk processing"
        }))
      });
    }
  },

  // Update a professor
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
    // Check if professor exists and is not deleted
    const existingProfessor = await prisma.professor.findUnique({ 
      where: { id },
      include: {
        credential: true
      }
    });

    if (!existingProfessor || existingProfessor.isDeleted) {
      return res.status(404).json({
        message: "Professor update failed",
        summary: {
          totalProcessed: 1,
          successCount: 0,
          failedCount: 1
        },
        successful: [],
        failed: [{
          email: 'Unknown',
          registrationNumber: 'Unknown',
          error: "Professor not found"
        }]
      });
    }

    // Validation
    const validationErrors: Array<{ field: string; message: string }> = [];

    if (!firstName) validationErrors.push({ field: "firstName", message: "First name is required" });
    if (!lastName) validationErrors.push({ field: "lastName", message: "Last name is required" });
    if (!email) validationErrors.push({ field: "email", message: "Email is required" });
    if (!departmentId) validationErrors.push({ field: "departmentId", message: "Department ID is required" });
    if (!professorRankId) validationErrors.push({ field: "professorRankId", message: "Professor rank ID is required" });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        summary: {
          totalProcessed: 1,
          successCount: 0,
          failedCount: 1
        },
        successful: [],
        failed: [{
          email: email || existingProfessor.email,
          registrationNumber: existingProfessor.registrationNumber,
          error: `Validation errors: ${validationErrors.map(e => e.message).join(', ')}`
        }]
      });
    }

    // Check if email is being changed and if new email already exists
    if (email !== existingProfessor.email) {
      const emailExists = await prisma.professor.findFirst({
        where: {
          email: email,
          id: { not: id }
        }
      });

      if (emailExists) {
        return res.status(400).json({
          message: "Professor update failed",
          summary: {
            totalProcessed: 1,
            successCount: 0,
            failedCount: 1
          },
          successful: [],
          failed: [{
            email: email,
            registrationNumber: existingProfessor.registrationNumber,
            error: "Email already exists in system"
          }]
        });
      }
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    });

    if (!department) {
      return res.status(400).json({
        message: "Professor update failed",
        summary: {
          totalProcessed: 1,
          successCount: 0,
          failedCount: 1
        },
        successful: [],
        failed: [{
          email: email,
          registrationNumber: existingProfessor.registrationNumber,
          error: `Department with ID ${departmentId} not found`
        }]
      });
    }

    // Check if professor rank exists
    const professorRank = await prisma.professorRank.findUnique({
      where: { id: professorRankId }
    });

    if (!professorRank) {
      return res.status(400).json({
        message: "Professor update failed",
        summary: {
          totalProcessed: 1,
          successCount: 0,
          failedCount: 1
        },
        successful: [],
        failed: [{
          email: email,
          registrationNumber: existingProfessor.registrationNumber,
          error: `Professor rank with ID ${professorRankId} not found`
        }]
      });
    }

    // Update professor and credential (if email changed) in transaction
    const updatedProfessor = await prisma.$transaction(async (tx) => {
      // Update credential if email changed
      if (email !== existingProfessor.email) {
        await tx.credential.update({
          where: { id: existingProfessor.credentialId },
          data: { email: email }
        });
      }

      return await tx.professor.update({
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
    });

    // Success response matching bulk format
    res.status(200).json({
      message: "Professor updated successfully",
      summary: {
        totalProcessed: 1,
        successCount: 1,
        failedCount: 0
      },
      successful: [{
        id: updatedProfessor.id,
        email: updatedProfessor.email,
        registrationNumber: updatedProfessor.registrationNumber,
        firstName: updatedProfessor.firstName,
        lastName: updatedProfessor.lastName || '',
        middleName: updatedProfessor.middleName || undefined,
        departmentId: updatedProfessor.departmentId,
        professorRankId: updatedProfessor.professorRankId,
        message: "Professor updated successfully"
      }],
      failed: []
    });

  } catch (error) {
    console.error("Error updating professor:", error);
    
    let errorMessage = "Failed to update professor due to system error";
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        errorMessage = "Professor with this email already exists";
      } else if (error.message.includes('Record to update not found')) {
        errorMessage = "Professor not found";
      } else {
        errorMessage = error.message;
      }
    }

    // Get professor details for error response
    let professorEmail = 'Unknown';
    let professorRegNumber = 'Unknown';
    
    try {
      const professor = await prisma.professor.findUnique({
        where: { id },
        select: { email: true, registrationNumber: true }
      });
      if (professor) {
        professorEmail = professor.email;
        professorRegNumber = professor.registrationNumber;
      }
    } catch (e) {
      // Ignore error in error handling
    }

    res.status(500).json({
      message: "Professor update failed",
      summary: {
        totalProcessed: 1,
        successCount: 0,
        failedCount: 1
      },
      successful: [],
      failed: [{
        email: professorEmail,
        registrationNumber: professorRegNumber,
        error: errorMessage
      }]
    });
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