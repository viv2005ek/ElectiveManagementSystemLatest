import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { hash } from "bcrypt";
import { UserRole, Gender } from "@prisma/client";

interface BulkStudentData {
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  contactNumber?: string;
  gender: Gender;
  semester: number;
  programId: string;
  batchId: string;
  password: string;
}

interface SuccessfulStudent {
  id: string;
  email: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  contactNumber?: string;
  gender: Gender;
  semester: number;
  programId: string;
  batchId: string;
  programName: string;
  batchYear: string;
  defaultPassword: string;
  message: string;
}

interface FailedStudent {
  email: string;
  registrationNumber: string;
  error: string;
  index?: number;
}

const studentController = {
  // Get all students (excluding deleted ones)
  getAllStudents: async (req: Request, res: Response): Promise<any> => {
    try {
      const {
        programId,
        batchId,
        semester,
        departmentId,
        schoolId,
        search,
        page = 1,
        pageSize = 10,
      } = req.query;

      // Build the where condition dynamically
      const where: any = { isDeleted: false };

      if (programId) {
        where.programId = String(programId);
      }
      if (batchId) {
        where.batchId = String(batchId);
      }
      if (semester) {
        where.semester = Number(semester);
      }
      if (departmentId) {
        where.program = { departmentId: String(departmentId) };
      }
      if (schoolId) {
        where.program = { department: { schoolId: String(schoolId) } };
      }

      // Ensure search is a string before using split()
      if (typeof search === "string" && search.trim() !== "") {
        const searchTerms = search
          .trim()
          .split(" ")
          .map((term) => ({
            contains: term,
            mode: "insensitive",
          }));

        where.OR = [
          {
            AND: [
              { firstName: searchTerms[0] },
              searchTerms[1] ? { middleName: searchTerms[1] } : {},
              searchTerms[2] ? { lastName: searchTerms[2] } : {},
            ],
          },
          {
            AND: [
              { firstName: searchTerms[0] },
              searchTerms[1] ? { lastName: searchTerms[1] } : {},
            ],
          },
          { registrationNumber: { contains: search, mode: "insensitive" } },
        ];
      }

      // Get total count of filtered students
      const totalStudents = await prisma.student.count({ where });
      const totalPages = Math.ceil(totalStudents / Number(pageSize));

      // Apply pagination AFTER filtering
      const students = await prisma.student.findMany({
        where,
        include: {
          program: {
            select: {
              id: true,
              name: true,
              department: {
                select: {
                  id: true,
                  name: true,
                  school: { select: { id: true, name: true } },
                },
              },
            },
          },
          batch: {
            select: {
              id: true,
              year: true,
            },
          },
        },
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        orderBy: { registrationNumber: "asc" },
      });

      res.status(200).json({
        students,
        totalPages,
        currentPage: Number(page),
        pageSize: Number(pageSize),
      });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Unable to fetch students" });
    }
  },

  // Get a student by ID
  getStudentById: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          program: {
            select: {
              id: true,
              name: true,
              department: {
                select: {
                  id: true,
                  name: true,
                  school: { select: { id: true, name: true } },
                },
              },
            },
          },
          batch: {
            select: {
              id: true,
              year: true,
            },
          },
        },
      });

      if (!student || student.isDeleted) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ message: "Unable to fetch student" });
    }
  },

  // Create a single student
  createStudent: async (req: Request, res: Response): Promise<any> => {
    const {
      firstName,
      lastName,
      email,
      registrationNumber,
      contactNumber,
      gender,
      semester,
      programId,
      batchId,
      password,
    } = req.body;

    // Validation
    const validationErrors: Array<{ field: string; message: string }> = [];

    if (!firstName) validationErrors.push({ field: "firstName", message: "First name is required" });
    if (!lastName) validationErrors.push({ field: "lastName", message: "Last name is required" });
    if (!email) validationErrors.push({ field: "email", message: "Email is required" });
    if (!registrationNumber) validationErrors.push({ field: "registrationNumber", message: "Registration number is required" });
    if (!gender) validationErrors.push({ field: "gender", message: "Gender is required" });
    if (!semester) validationErrors.push({ field: "semester", message: "Semester is required" });
    if (!programId) validationErrors.push({ field: "programId", message: "Program ID is required" });
    if (!batchId) validationErrors.push({ field: "batchId", message: "Batch ID is required" });
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
      // Check if student already exists
      const existingStudent = await prisma.student.findFirst({
        where: {
          OR: [
            { email },
            { registrationNumber },
          ],
        },
      });

      if (existingStudent) {
        return res.status(400).json({
          message: "Student creation failed",
          summary: {
            totalProcessed: 1,
            successCount: 0,
            failedCount: 1
          },
          successful: [],
          failed: [{
            email,
            registrationNumber,
            error: "Student with this email or registration number already exists"
          }]
        });
      }

      // Check if program exists
      const program = await prisma.program.findUnique({
        where: { id: programId }
      });

      if (!program) {
        return res.status(400).json({
          message: "Student creation failed",
          summary: {
            totalProcessed: 1,
            successCount: 0,
            failedCount: 1
          },
          successful: [],
          failed: [{
            email,
            registrationNumber,
            error: `Program with ID ${programId} not found`
          }]
        });
      }

      // Check if batch exists
      const batch = await prisma.batch.findUnique({
        where: { id: batchId }
      });

      if (!batch) {
        return res.status(400).json({
          message: "Student creation failed",
          summary: {
            totalProcessed: 1,
            successCount: 0,
            failedCount: 1
          },
          successful: [],
          failed: [{
            email,
            registrationNumber,
            error: `Batch with ID ${batchId} not found`
          }]
        });
      }

      // Hash password
      const hashedPassword = await hash(password, 10);

      // Create student with credential in transaction
      const student = await prisma.$transaction(async (tx) => {
        const credential = await tx.credential.create({
          data: {
            email,
            passwordHash: hashedPassword,
            role: UserRole.Student,
          },
        });

        // Create the student
        const createdStudent = await tx.student.create({
          data: {
            firstName,
            lastName,
            email,
            registrationNumber,
            contactNumber: contactNumber || undefined,
            gender: gender as Gender,
            semester: parseInt(semester),
            programId,
            batchId,
            credentialId: credential.id,
          },
        });

        // Then fetch the student with relations separately
        const studentWithRelations = await tx.student.findUnique({
          where: { id: createdStudent.id },
          include: {
            program: {
              select: {
                id: true,
                name: true,
              },
            },
            batch: {
              select: {
                id: true,
                year: true,
              },
            },
          },
        });

        if (!studentWithRelations) {
          throw new Error("Failed to fetch created student with relations");
        }

        return studentWithRelations;
      });

      // Success response matching bulk format
      res.status(201).json({
        message: "Student created successfully",
        summary: {
          totalProcessed: 1,
          successCount: 1,
          failedCount: 0
        },
        successful: [{
          id: student.id,
          email: student.email,
          registrationNumber: student.registrationNumber,
          firstName: student.firstName,
          lastName: student.lastName || '',
          contactNumber: student.contactNumber || undefined,
          gender: student.gender,
          semester: student.semester,
          programId: student.programId,
          batchId: student.batchId,
          programName: student.program.name,
          batchYear: student.batch.year.toString(),
          defaultPassword: password,
          message: "Student created successfully"
        }],
        failed: []
      });

    } catch (error) {
      console.error("Error creating student:", error);
      
      let errorMessage = "Failed to create student due to system error";
      if (error instanceof Error) {
        if (error.message.includes('Unique constraint')) {
          errorMessage = "Student with this email or registration number already exists";
        } else {
          errorMessage = error.message;
        }
      }

      res.status(500).json({
        message: "Student creation failed",
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

  // Bulk add students with detailed error reporting
  bulkAddStudents: async (req: Request, res: Response): Promise<any> => {
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ 
        message: "Students array is required and cannot be empty",
        summary: {
          totalProcessed: 0,
          successCount: 0,
          failedCount: 0
        },
        successful: [],
        failed: []
      });
    }

    // Validate each student data
    const validationErrors: FailedStudent[] = [];

    students.forEach((student: BulkStudentData, index: number) => {
      if (!student.firstName) {
        validationErrors.push({
          email: student.email || 'Unknown',
          registrationNumber: student.registrationNumber || 'Unknown',
          error: "First name is required",
          index
        });
      }
      if (!student.lastName) {
        validationErrors.push({
          email: student.email || 'Unknown',
          registrationNumber: student.registrationNumber || 'Unknown',
          error: "Last name is required",
          index
        });
      }
      if (!student.email) {
        validationErrors.push({
          email: 'Unknown',
          registrationNumber: student.registrationNumber || 'Unknown',
          error: "Email is required",
          index
        });
      }
      if (!student.registrationNumber) {
        validationErrors.push({
          email: student.email || 'Unknown',
          registrationNumber: 'Unknown',
          error: "Registration number is required",
          index
        });
      }
      if (!student.gender) {
        validationErrors.push({
          email: student.email || 'Unknown',
          registrationNumber: student.registrationNumber || 'Unknown',
          error: "Gender is required",
          index
        });
      }
      if (!student.semester) {
        validationErrors.push({
          email: student.email || 'Unknown',
          registrationNumber: student.registrationNumber || 'Unknown',
          error: "Semester is required",
          index
        });
      }
      if (!student.programId) {
        validationErrors.push({
          email: student.email || 'Unknown',
          registrationNumber: student.registrationNumber || 'Unknown',
          error: "Program ID is required",
          index
        });
      }
      if (!student.batchId) {
        validationErrors.push({
          email: student.email || 'Unknown',
          registrationNumber: student.registrationNumber || 'Unknown',
          error: "Batch ID is required",
          index
        });
      }
      if (!student.password) {
        validationErrors.push({
          email: student.email || 'Unknown',
          registrationNumber: student.registrationNumber || 'Unknown',
          error: "Password is required",
          index
        });
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed for some students",
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
      // Check for existing students to avoid duplicates
      const emails = students.map(s => s.email);
      const registrationNumbers = students.map(s => s.registrationNumber);

      const existingStudents = await prisma.student.findMany({
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

      const existingEmails = new Set(existingStudents.map(s => s.email));
      const existingRegistrationNumbers = new Set(existingStudents.map(s => s.registrationNumber));

      const results = {
        successful: [] as SuccessfulStudent[],
        failed: [] as FailedStudent[]
      };

      // First pass: Check for duplicates and add to failed list
      students.forEach((studentData: BulkStudentData, index: number) => {
        if (existingEmails.has(studentData.email)) {
          results.failed.push({
            email: studentData.email,
            registrationNumber: studentData.registrationNumber,
            error: "Email already exists in system",
            index
          });
          return;
        }

        if (existingRegistrationNumbers.has(studentData.registrationNumber)) {
          results.failed.push({
            email: studentData.email,
            registrationNumber: studentData.registrationNumber,
            error: "Registration number already exists in system",
            index
          });
          return;
        }

        // Check for duplicates within the same batch
        const duplicateInBatch = students.slice(0, index).some((s, i) => 
          s.email === studentData.email || s.registrationNumber === studentData.registrationNumber
        );

        if (duplicateInBatch) {
          results.failed.push({
            email: studentData.email,
            registrationNumber: studentData.registrationNumber,
            error: "Duplicate email or registration number within the batch",
            index
          });
          return;
        }

        // Add to existing sets to track duplicates in current batch
        existingEmails.add(studentData.email);
        existingRegistrationNumbers.add(studentData.registrationNumber);
      });

      // Filter out students that failed duplicate checks
      const studentsToProcess = students.filter((student, index) => 
        !results.failed.some(failed => failed.index === index)
      );

      // Process remaining students in batches
      const BATCH_SIZE = 10;
      
      for (let i = 0; i < studentsToProcess.length; i += BATCH_SIZE) {
        const batch = studentsToProcess.slice(i, i + BATCH_SIZE);
        
        await Promise.all(
          batch.map(async (studentData: BulkStudentData) => {
            try {
              const hashedPassword = await hash(studentData.password, 10);

              // Create student in transaction
              const student = await prisma.$transaction(async (tx) => {
                // Check if program exists
                const program = await tx.program.findUnique({
                  where: { id: studentData.programId }
                });

                if (!program) {
                  throw new Error(`Program with ID ${studentData.programId} not found`);
                }

                // Check if batch exists
                const batch = await tx.batch.findUnique({
                  where: { id: studentData.batchId }
                });

                if (!batch) {
                  throw new Error(`Batch with ID ${studentData.batchId} not found`);
                }

                const credential = await tx.credential.create({
                  data: {
                    email: studentData.email,
                    passwordHash: hashedPassword,
                    role: UserRole.Student,
                  },
                });

                // Create the student
                const createdStudent = await tx.student.create({
                  data: {
                    firstName: studentData.firstName,
                    lastName: studentData.lastName,
                    email: studentData.email,
                    registrationNumber: studentData.registrationNumber,
                    contactNumber: studentData.contactNumber || "undefined",
                    gender: studentData.gender,
                    semester: studentData.semester,
                    programId: studentData.programId,
                    batchId: studentData.batchId,
                    credentialId: credential.id,
                  },
                });

                // Then fetch the student with relations separately
                const studentWithRelations = await tx.student.findUnique({
                  where: { id: createdStudent.id },
                  include: {
                    program: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    batch: {
                      select: {
                        id: true,
                        year: true,
                      },
                    },
                  },
                });

                if (!studentWithRelations) {
                  throw new Error("Failed to fetch created student with relations");
                }

                return studentWithRelations;
              });

              results.successful.push({
                id: student.id,
                email: student.email,
                registrationNumber: student.registrationNumber,
                firstName: student.firstName,
                lastName: student.lastName || '',
                contactNumber: student.contactNumber || undefined,
                gender: student.gender,
                semester: student.semester,
                programId: student.programId,
                batchId: student.batchId,
                programName: student.program.name,
                batchYear: student.batch.year.toString(),
                defaultPassword: studentData.password,
                message: "Student created successfully"
              });

            } catch (error) {
              console.error(`Error creating student ${studentData.email}:`, error);
              
              let errorMessage = "Failed to create student";
              if (error instanceof Error) {
                if (error.message.includes('Program')) {
                  errorMessage = `Program not found: ${studentData.programId}`;
                } else if (error.message.includes('Batch')) {
                  errorMessage = `Batch not found: ${studentData.batchId}`;
                } else if (error.message.includes('Unique constraint')) {
                  errorMessage = "Duplicate email or registration number (race condition)";
                } else {
                  errorMessage = error.message;
                }
              }

              results.failed.push({
                email: studentData.email,
                registrationNumber: studentData.registrationNumber,
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
        finalMessage = "All students created successfully";
      } else if (failedCount === totalProcessed) {
        finalMessage = "All students failed to create";
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
      console.error("Error in bulk student creation:", error);
      res.status(500).json({ 
        message: "Unable to process bulk student creation",
        summary: {
          totalProcessed: 0,
          successCount: 0,
          failedCount: students.length
        },
        successful: [],
        failed: students.map(student => ({
          email: student.email,
          registrationNumber: student.registrationNumber,
          error: "System error during bulk processing"
        }))
      });
    }
  },

  // Update a student
  updateStudent: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      gender,
      semester,
      programId,
      batchId
    } = req.body;

    try {
      // Check if student exists and is not deleted
      const existingStudent = await prisma.student.findUnique({ 
        where: { id },
        include: {
          credential: true
        }
      });

      if (!existingStudent || existingStudent.isDeleted) {
        return res.status(404).json({
          message: "Student update failed",
          summary: {
            totalProcessed: 1,
            successCount: 0,
            failedCount: 1
          },
          successful: [],
          failed: [{
            email: 'Unknown',
            registrationNumber: 'Unknown',
            error: "Student not found"
          }]
        });
      }

      // Validation
      const validationErrors: Array<{ field: string; message: string }> = [];

      if (!firstName) validationErrors.push({ field: "firstName", message: "First name is required" });
      if (!lastName) validationErrors.push({ field: "lastName", message: "Last name is required" });
      if (!email) validationErrors.push({ field: "email", message: "Email is required" });
      if (!gender) validationErrors.push({ field: "gender", message: "Gender is required" });
      if (!semester) validationErrors.push({ field: "semester", message: "Semester is required" });
      if (!programId) validationErrors.push({ field: "programId", message: "Program ID is required" });
      if (!batchId) validationErrors.push({ field: "batchId", message: "Batch ID is required" });

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
            email: email || existingStudent.email,
            registrationNumber: existingStudent.registrationNumber,
            error: `Validation errors: ${validationErrors.map(e => e.message).join(', ')}`
          }]
        });
      }

      // Check if email is being changed and if new email already exists
      if (email !== existingStudent.email) {
        const emailExists = await prisma.student.findFirst({
          where: {
            email: email,
            id: { not: id }
          }
        });

        if (emailExists) {
          return res.status(400).json({
            message: "Student update failed",
            summary: {
              totalProcessed: 1,
              successCount: 0,
              failedCount: 1
            },
            successful: [],
            failed: [{
              email: email,
              registrationNumber: existingStudent.registrationNumber,
              error: "Email already exists in system"
            }]
          });
        }
      }

      // Check if program exists
      const program = await prisma.program.findUnique({
        where: { id: programId }
      });

      if (!program) {
        return res.status(400).json({
          message: "Student update failed",
          summary: {
            totalProcessed: 1,
            successCount: 0,
            failedCount: 1
          },
          successful: [],
          failed: [{
            email: email,
            registrationNumber: existingStudent.registrationNumber,
            error: `Program with ID ${programId} not found`
          }]
        });
      }

      // Check if batch exists
      const batch = await prisma.batch.findUnique({
        where: { id: batchId }
      });

      if (!batch) {
        return res.status(400).json({
          message: "Student update failed",
          summary: {
            totalProcessed: 1,
            successCount: 0,
            failedCount: 1
          },
          successful: [],
          failed: [{
            email: email,
            registrationNumber: existingStudent.registrationNumber,
            error: `Batch with ID ${batchId} not found`
          }]
        });
      }

      // Update student and credential (if email changed) in transaction
      const updatedStudent = await prisma.$transaction(async (tx) => {
        // Update credential if email changed
        if (email !== existingStudent.email) {
          await tx.credential.update({
            where: { id: existingStudent.credentialId },
            data: { email: email }
          });
        }

        return await tx.student.update({
          where: { id },
          data: {
            firstName,
            lastName,
            email,
            contactNumber: contactNumber || undefined,
            gender: gender as Gender,
            semester: parseInt(semester),
            programId,
            batchId,
          },
          include: {
            program: {
              select: {
                id: true,
                name: true,
                department: {
                  select: {
                    id: true,
                    name: true,
                    school: { select: { id: true, name: true } },
                  },
                },
              },
            },
            batch: {
              select: {
                id: true,
                year: true,
              },
            },
          },
        });
      });

      // Success response matching bulk format
      res.status(200).json({
        message: "Student updated successfully",
        summary: {
          totalProcessed: 1,
          successCount: 1,
          failedCount: 0
        },
        successful: [{
          id: updatedStudent.id,
          email: updatedStudent.email,
          registrationNumber: updatedStudent.registrationNumber,
          firstName: updatedStudent.firstName,
          lastName: updatedStudent.lastName || '',
          contactNumber: updatedStudent.contactNumber || undefined,
          gender: updatedStudent.gender,
          semester: updatedStudent.semester,
          programId: updatedStudent.programId,
          batchId: updatedStudent.batchId,
          message: "Student updated successfully"
        }],
        failed: []
      });

    } catch (error) {
      console.error("Error updating student:", error);
      
      let errorMessage = "Failed to update student due to system error";
      if (error instanceof Error) {
        if (error.message.includes('Unique constraint')) {
          errorMessage = "Student with this email already exists";
        } else if (error.message.includes('Record to update not found')) {
          errorMessage = "Student not found";
        } else {
          errorMessage = error.message;
        }
      }

      // Get student details for error response
      let studentEmail = 'Unknown';
      let studentRegNumber = 'Unknown';
      
      try {
        const student = await prisma.student.findUnique({
          where: { id },
          select: { email: true, registrationNumber: true }
        });
        if (student) {
          studentEmail = student.email;
          studentRegNumber = student.registrationNumber;
        }
      } catch (e) {
        // Ignore error in error handling
      }

      res.status(500).json({
        message: "Student update failed",
        summary: {
          totalProcessed: 1,
          successCount: 0,
          failedCount: 1
        },
        successful: [],
        failed: [{
          email: studentEmail,
          registrationNumber: studentRegNumber,
          error: errorMessage
        }]
      });
    }
  },

  // Soft delete a student
  deleteStudent: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
      const student = await prisma.student.findUnique({ where: { id } });

      if (!student || student.isDeleted) {
        return res.status(404).json({ message: "Student not found" });
      }

      await prisma.student.update({
        where: { id },
        data: { isDeleted: true },
      });

      res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ message: "Unable to delete student" });
    }
  },
};

export default studentController;