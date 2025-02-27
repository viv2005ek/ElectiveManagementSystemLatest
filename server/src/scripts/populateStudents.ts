import { PrismaClient } from "@prisma/client";
import csv from "csv-parser";
import { formatName } from "./formatName";
import { hash } from "bcrypt";
import * as fs from "node:fs";

const prisma = new PrismaClient();

interface StudentCSV {
  "Student Name": string;
}

const generateRandomRegistrationNumber = (): string => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

const importStudents = async () => {
  try {
    // Fetch all programs and batches from the database
    const programs = await prisma.program.findMany({ select: { id: true } });
    const batches = await prisma.batch.findMany({ select: { id: true } });
    console.log({ programs, batches });

    if (programs.length === 0 || batches.length === 0) {
      throw new Error("No programs or batches found in the database!");
    }

    console.log(
      `Found ${programs.length} programs and ${batches.length} batches.`,
    );

    const students: StudentCSV[] = [];

    fs.createReadStream("students.csv")
      .pipe(csv())
      .on("data", (row) => {
        students.push(row);
      })
      .on("end", async () => {
        console.log(`Read ${students.length} students from CSV.`);

        for (const student of students) {
          const { firstName, lastName } = formatName(student["Student Name"]);
          const registrationNumber = generateRandomRegistrationNumber();

          // Assign a random program and batch
          const randomProgram =
            programs[Math.floor(Math.random() * programs.length)];
          const randomBatch =
            batches[Math.floor(Math.random() * batches.length)];

          try {
            const hashedPassword = await hash("defaultpassword", 10);

            await prisma.student.create({
              data: {
                registrationNumber,
                firstName,
                lastName,
                email: `${registrationNumber}@example.com`,
                gender: "Other",
                semester: 1,
                contactNumber: generateRandomRegistrationNumber(), // Placeholder contact number
                credential: {
                  create: {
                    email: `${firstName}${lastName}@gmail.com`,
                    passwordHash: hashedPassword,
                    role: "Student",
                  },
                },
                program: {
                  connect: { id: randomProgram.id },
                },
                batch: {
                  connect: { id: randomBatch.id },
                },
              },
            });

            console.log(
              `Added student: ${firstName} ${lastName}, Registration Number: ${registrationNumber}, Program: ${randomProgram.id}, Batch: ${randomBatch.id}`,
            );
          } catch (error) {
            console.error(
              `Error adding student ${registrationNumber}:`,
              (error as Error).message,
            );
          }
        }

        await prisma.$disconnect();
      });
  } catch (error) {
    console.error("Error during student import:", (error as Error).message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

importStudents();
