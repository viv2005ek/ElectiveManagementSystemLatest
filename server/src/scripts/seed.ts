import {AllotmentType} from "@prisma/client";
import {v4 as uuidv4} from "uuid";
import {prisma} from "../prismaClient";

async function main() {
  // Create Course Categories
  const categories = await Promise.all([
    prisma.courseCategory.create({
      data: { name: "Flexi Core", allotmentType: AllotmentType.STANDALONE },
    }),
    prisma.courseCategory.create({
      data: {
        name: "Minor Specialization",
        allotmentType: AllotmentType.BUCKET,
      },
    }),
    prisma.courseCategory.create({
      data: {
        name: "Programme Elective",
        allotmentType: AllotmentType.STANDALONE,
      },
    }),
  ]);

  // Create Departments
  const departments = await Promise.all(
    Array.from({ length: 4 }, (_, i) =>
      prisma.department.create({
        data: {
          name: `Department ${i + 1}`,
        },
      }),
    ),
  );

  // Create Branches for each Department
  const branches = await Promise.all(
    departments.map((department) =>
      Promise.all(
        Array.from({ length: 3 }, (_, i) =>
          prisma.branch.create({
            data: {
              name: `Branch ${i + 1} of ${department.name}`,
              departmentId: department.id,
            },
          }),
        ),
      ),
    ),
  );

  // Create Courses for each Department
  const courses = await Promise.all(
    departments.map((department) =>
      Promise.all(
        Array.from({ length: 5 }, (_, i) =>
          prisma.course.create({
            data: {
              name: `Course ${i + 1} - ${department.name}`,
              code: `C-${uuidv4().slice(0, 8)}`,
              credits: Math.floor(Math.random() * 4) + 2,
              departmentId: department.id,
              courseCategories: {
                connect: { id: categories[i % categories.length].id },
              },
            },
          }),
        ),
      ),
    ),
  );

  // Create Course Buckets
  const courseBuckets = await Promise.all(
    departments.map((department, index) =>
      prisma.courseBucket.create({
        data: {
          name: `Course Bucket for ${department.name}`,
          departmentId: department.id,
          courses: {
            connect: courses[index].map((course) => ({ id: course.id })),
          },
        },
      }),
    ),
  );

  // Create Credentials for Students, Faculty, and Admins
  const studentCredentials = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.credential.create({
        data: {
          email: `student${i + 1}@example.com`,
          passwordHash: `hashedPassword${i + 1}`,
          role: "STUDENT",
        },
      }),
    ),
  );

  const facultyCredentials = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.credential.create({
        data: {
          email: `faculty${i + 1}@example.com`,
          passwordHash: `hashedPassword${i + 1}`,
          role: "FACULTY",
        },
      }),
    ),
  );

  const adminCredentials = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.credential.create({
        data: {
          email: `admin${i + 1}@example.com`,
          passwordHash: `hashedPassword${i + 1}`,
          role: "ADMIN",
        },
      }),
    ),
  );

  // Create Students
  await Promise.all(
    studentCredentials.map((credential, index) => {
      const branch = branches[index % branches.length][index % 3];
      return prisma.student.create({
        data: {
          registrationNumber: `S${index + 1}`,
          email: credential.email,
          firstName: `Student ${index + 1}`,
          lastName: `Lastname ${index + 1}`,
          gender: index % 2 === 0 ? "MALE" : "FEMALE",
          semester: 1,
          section: "A",
          batch: 2025,
          branchId: branch.id,
          contactNumber: `98765432${index + 1}`,
          credentialId: credential.id,
        },
      });
    }),
  );

  // Create Faculty
  await Promise.all(
    facultyCredentials.map((credential, index) =>
      prisma.faculty.create({
        data: {
          registrationNumber: `F${index + 1}`,
          email: credential.email,
          firstName: `Faculty ${index + 1}`,
          lastName: `Lastname ${index + 1}`,
          departmentId: departments[index % 4].id,
          credentialId: credential.id,
        },
      }),
    ),
  );

  // Create Admins
  await Promise.all(
    adminCredentials.map((credential, index) =>
      prisma.admin.create({
        data: {
          registrationNumber: `A${index + 1}`,
          email: credential.email,
          firstName: `Admin ${index + 1}`,
          lastName: `Lastname ${index + 1}`,
          credentialId: credential.id,
        },
      }),
    ),
  );

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
