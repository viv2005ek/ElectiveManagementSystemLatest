import { PrismaClient } from '@prisma/client';
import {v4} from 'uuid'
const prisma = new PrismaClient();

async function main() {
  // Create Departments
  const departments = await Promise.all(
    Array.from({ length: 4 }, (_, i) =>
      prisma.department.create({
        data: {
          name: `Department ${i + 1}`,
        },
      })
    )
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
          })
        )
      )
    )
  );

  // Create Minor Specializations for each department
  const minorSpecializations = await Promise.all(
    departments.map((department) =>
      Promise.all(
        Array.from({ length: 3 }, (_, i) => {
          return prisma.minorSpecialization.create({
            data: {
              name: `Minor Specialization ${i + 1} - ${v4()}`, // Ensures uniqueness
              departmentId: department.id,
            },
          });
        })
      )
    )
  );

  // Create Programme Electives for each Minor Specialization
  const programmeElectives = await Promise.all(
    minorSpecializations.flat().map((minorSpecialization) =>
      Promise.all(
        Array.from({ length: 4 }, (_, i) =>
          prisma.programmeElective.create({
            data: {
              courseCode: `PE-${minorSpecialization.name}-${i + 1}`,
              name: `${minorSpecialization.name} Programme Elective ${i + 1}`,
              departmentId: minorSpecialization.departmentId,
              minorSpecializationId: minorSpecialization.id,
            },
          })
        )
      )
    )
  );

  // Create Independent Programme Electives
  await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.programmeElective.create({
        data: {
          courseCode: `PE-IND-${i + 1}`,
          name: `Independent Programme Elective ${i + 1}`,
          isIndependentCourse: true,
        },
      })
    )
  );

  // Create Credentials for Students, Faculty, and Admins
  const studentCredentials = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.credential.create({
        data: {
          email: `student${i + 1}@example.com`,
          passwordHash: `passwordHashForStudent${i + 1}`,
          role: 'STUDENT',
        },
      })
    )
  );

  const facultyCredentials = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.credential.create({
        data: {
          email: `faculty${i + 1}@example.com`,
          passwordHash: `passwordHashForFaculty${i + 1}`,
          role: 'FACULTY',
        },
      })
    )
  );

  const adminCredentials = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.credential.create({
        data: {
          email: `admin${i + 1}@example.com`,
          passwordHash: `passwordHashForAdmin${i + 1}`,
          role: 'ADMIN',
        },
      })
    )
  );

  // Create Students with associated Credentials
  await Promise.all(
    studentCredentials.map((credential, index) => {
      const department = departments[index % departments.length];
      const branch = branches[departments.indexOf(department)][index % 3]; // Assign a branch from the correct department

      return prisma.student.create({
        data: {
          registrationNumber: `S${index + 1}`,
          email: `student${index + 1}@example.com`,
          firstName: `Student First Name ${index + 1}`,
          lastName: `Student Last Name ${index + 1}`,
          gender: index % 2 === 0 ? 'MALE' : 'FEMALE',
          semester: 1,
          section: 'A',
          batch: 2025,
          branchId: branch.id,
          contactNumber: `98765432${index + 1}`,
          credentialId: credential.id,
        },
      });
    })
  );

  // Create Faculty with associated Credentials
  await Promise.all(
    facultyCredentials.map((credential, index) =>
      prisma.faculty.create({
        data: {
          registrationNumber: `F${index + 1}`,
          email: `faculty${index + 1}@example.com`,
          firstName: `Faculty First Name ${index + 1}`,
          lastName: `Faculty Last Name ${index + 1}`,
          departmentId: departments[index % 4].id,
          credentialId: credential.id,
        },
      })
    )
  );

  // Create Admins with associated Credentials
  await Promise.all(
    adminCredentials.map((credential, index) =>
      prisma.admin.create({
        data: {
          registrationNumber: `A${index + 1}`,
          email: `admin${index + 1}@example.com`,
          firstName: `Admin First Name ${index + 1}`,
          lastName: `Admin Last Name ${index + 1}`,
          credentialId: credential.id,
        },
      })
    )
  );

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
