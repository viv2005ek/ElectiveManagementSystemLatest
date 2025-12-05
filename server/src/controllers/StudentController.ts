import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { hash } from "bcrypt";
import { UserRole, Gender } from "@prisma/client";
import bcrypt from "bcrypt";
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
  // controllers/StudentController.ts - Optimized bulkAddStudents function

// Bulk add students with optimized performance
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

  // console.log(`Starting bulk upload for ${students.length} students`);

  const results = {
    successful: [] as SuccessfulStudent[],
    failed: [] as FailedStudent[]
  };

  try {
    // Pre-validation - check for required fields
    students.forEach((student: BulkStudentData, index: number) => {
      if (!student.firstName || !student.lastName || !student.email || !student.registrationNumber) {
        results.failed.push({
          email: student.email || 'Unknown',
          registrationNumber: student.registrationNumber || 'Unknown',
          error: "Missing required fields (firstName, lastName, email, or registrationNumber)",
          index
        });
      }
    });

    // Filter out invalid students
    const validStudents = students.filter((student, index) => 
      !results.failed.some(failed => failed.index === index)
    );

    if (validStudents.length === 0) {
      return res.status(400).json({
        message: "All students failed validation",
        summary: {
          totalProcessed: students.length,
          successCount: 0,
          failedCount: results.failed.length
        },
        successful: [],
        failed: results.failed
      });
    }

    // Check for duplicates in one query
    const emails = validStudents.map(s => s.email);
    const registrationNumbers = validStudents.map(s => s.registrationNumber);

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

    // Check for duplicates within the current batch
    const seenEmails = new Set();
    const seenRegNumbers = new Set();

    validStudents.forEach((student, index) => {
      const originalIndex = students.findIndex(s => 
        s.email === student.email && s.registrationNumber === student.registrationNumber
      );

      if (existingEmails.has(student.email)) {
        results.failed.push({
          email: student.email,
          registrationNumber: student.registrationNumber,
          error: "Email already exists in system",
          index: originalIndex
        });
        return;
      }

      if (existingRegistrationNumbers.has(student.registrationNumber)) {
        results.failed.push({
          email: student.email,
          registrationNumber: student.registrationNumber,
          error: "Registration number already exists in system",
          index: originalIndex
        });
        return;
      }

      if (seenEmails.has(student.email) || seenRegNumbers.has(student.registrationNumber)) {
        results.failed.push({
          email: student.email,
          registrationNumber: student.registrationNumber,
          error: "Duplicate email or registration number within the batch",
          index: originalIndex
        });
        return;
      }

      seenEmails.add(student.email);
      seenRegNumbers.add(student.registrationNumber);
    });

    // Final list of students to process
    const studentsToProcess = validStudents.filter((student) => 
      !results.failed.some(failed => 
        failed.email === student.email && failed.registrationNumber === student.registrationNumber
      )
    );

    // console.log(`Processing ${studentsToProcess.length} valid students out of ${students.length} total`);

    if (studentsToProcess.length === 0) {
      return res.status(400).json({
        message: "All students failed duplicate checks",
        summary: {
          totalProcessed: students.length,
          successCount: 0,
          failedCount: results.failed.length
        },
        successful: [],
        failed: results.failed
      });
    }

    // Process students in smaller batches to avoid transaction timeouts
    const BATCH_SIZE = 50; // Increased batch size for better performance
    const totalBatches = Math.ceil(studentsToProcess.length / BATCH_SIZE);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIdx = batchIndex * BATCH_SIZE;
      const endIdx = Math.min(startIdx + BATCH_SIZE, studentsToProcess.length);
      const batch = studentsToProcess.slice(startIdx, endIdx);

      // console.log(`Processing batch ${batchIndex + 1}/${totalBatches} with ${batch.length} students`);

      try {
        // Process batch in a single transaction for better performance
        const batchResults = await prisma.$transaction(async (tx) => {
          const batchSuccessful: SuccessfulStudent[] = [];
          const batchFailed: FailedStudent[] = [];

          // Pre-fetch all programs and batches for this batch
          const programIds = [...new Set(batch.map(s => s.programId))];
          const batchIds = [...new Set(batch.map(s => s.batchId))];

          const programs = await tx.program.findMany({
            where: { id: { in: programIds } },
            select: { id: true, name: true }
          });

          const batches = await tx.batch.findMany({
            where: { id: { in: batchIds } },
            select: { id: true, year: true }
          });

          const programMap = new Map(programs.map(p => [p.id, p]));
          const batchMap = new Map(batches.map(b => [b.id, b]));

          // Process each student in the current batch
          for (const studentData of batch) {
            try {
              const program = programMap.get(studentData.programId);
              const batch = batchMap.get(studentData.batchId);

              if (!program) {
                batchFailed.push({
                  email: studentData.email,
                  registrationNumber: studentData.registrationNumber,
                  error: `Program with ID ${studentData.programId} not found`
                });
                continue;
              }

              if (!batch) {
                batchFailed.push({
                  email: studentData.email,
                  registrationNumber: studentData.registrationNumber,
                  error: `Batch with ID ${studentData.batchId} not found`
                });
                continue;
              }

              // Hash password
              const hashedPassword = await hash(studentData.password, 10);

              // Create credential
              const credential = await tx.credential.create({
                data: {
                  email: studentData.email,
                  passwordHash: hashedPassword,
                  role: UserRole.Student,
                },
              });

              // Create student
              const createdStudent = await tx.student.create({
                data: {
                  firstName: studentData.firstName,
                  lastName: studentData.lastName,
                  email: studentData.email,
                  registrationNumber: studentData.registrationNumber,
                  contactNumber: studentData.contactNumber || null,
                  gender: studentData.gender,
                  semester: studentData.semester,
                  programId: studentData.programId,
                  batchId: studentData.batchId,
                  credentialId: credential.id,
                },
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

              batchSuccessful.push({
                id: createdStudent.id,
                email: createdStudent.email,
                registrationNumber: createdStudent.registrationNumber,
                firstName: createdStudent.firstName,
                lastName: createdStudent.lastName || '',
                contactNumber: createdStudent.contactNumber || undefined,
                gender: createdStudent.gender,
                semester: createdStudent.semester,
                programId: createdStudent.programId,
                batchId: createdStudent.batchId,
                programName: createdStudent.program.name,
                batchYear: createdStudent.batch.year.toString(),
                defaultPassword: studentData.password,
                message: "Student created successfully"
              });

            } catch (error) {
              console.error(`Error creating student ${studentData.email}:`, error);
              
              let errorMessage = "Failed to create student";
              if (error instanceof Error) {
                if (error.message.includes('Unique constraint')) {
                  errorMessage = "Duplicate email or registration number";
                } else {
                  errorMessage = error.message;
                }
              }

              batchFailed.push({
                email: studentData.email,
                registrationNumber: studentData.registrationNumber,
                error: errorMessage
              });
            }
          }

          return { batchSuccessful, batchFailed };
        }, {
          maxWait: 30000000, // 30000 seconds max wait
          timeout: 60000000  // 60000 seconds timeout
        });

        results.successful.push(...batchResults.batchSuccessful);
        results.failed.push(...batchResults.batchFailed);

        // Small delay between batches to prevent overwhelming the database
        if (batchIndex < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (batchError) {
        console.error(`Batch ${batchIndex + 1} failed:`, batchError);
        
        // Mark all students in this batch as failed
        batch.forEach(studentData => {
          results.failed.push({
            email: studentData.email,
            registrationNumber: studentData.registrationNumber,
            error: "Batch processing failed - transaction timeout or system error"
          });
        });
      }
    }

    // Prepare final response
    const successCount = results.successful.length;
    const failedCount = results.failed.length;
    const totalProcessed = students.length;

    let finalMessage = "";
    if (successCount === totalProcessed) {
      finalMessage = "All students created successfully";
    } else if (failedCount === totalProcessed) {
      finalMessage = "All students failed to create";
    } else {
      finalMessage = `Bulk operation completed with ${successCount} successful and ${failedCount} failed`;
    }

    // console.log(`Bulk upload completed: ${successCount} successful, ${failedCount} failed`);

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
    
    // If we get here, it's a system-level error
    res.status(500).json({ 
      message: "Unable to process bulk student creation due to system error",
      summary: {
        totalProcessed: students.length,
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
    batchId,
    password // Add this
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
    
    // Add password validation if password is provided
    if (password && password.length < 6) {
      validationErrors.push({ field: "password", message: "Password must be at least 6 characters long" });
    }

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

    // Update student and credential in transaction
    const updatedStudent = await prisma.$transaction(async (tx) => {
      // Prepare credential update data
      const credentialUpdateData: any = {};
      
      if (email !== existingStudent.email) {
        credentialUpdateData.email = email;
      }
      
      // Hash password if provided
      if (password && password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        credentialUpdateData.passwordHash = await bcrypt.hash(password, salt);
      }

      // Update credential if there are changes
      if (Object.keys(credentialUpdateData).length > 0) {
        await tx.credential.update({
          where: { id: existingStudent.credentialId },
          data: credentialUpdateData
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
        message: "Student updated successfully" + (password ? " with password change" : "")
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