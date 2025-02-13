import { useEffect, useState } from "react";

type Elective = {
  subject: string;
  credits: number;
};

type Student = {
  name: string;
  registrationNo: string;
  mobileNo1: string;
  mobileNo2: string;
  departmentName: string;
  branchName: string;
  semester: string;
  classCoordinator: boolean;
  profilePic: string | null;
  classCoordinatorName: string;
  mailId: string;
  section: string;
  batchNo: string;
  gender: string;
  elective: Elective;
};

type InfoStudentPopUpProps = {
  id: string | null;
  onClose: () => void;
};

export default function InfoStudentPopUp({
  id,
  onClose,
}: InfoStudentPopUpProps) {
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (id) {
      const fetchStudent = async () => {
        try {
          const response = await fetch(`https://apiems.shreshth.tech/students/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch student data");
          }
          const data = await response.json();
          
          // Assuming the API response has the structure similar to the previous example
          const fetchedStudent: Student = {
            name: `${data.firstName} ${data.lastName}`,
            registrationNo: data.registrationNumber,
            mobileNo1: data.mobileNumber1,
            mobileNo2: data.mobileNumber2,
            departmentName: data.branch?.department?.name || "Unknown",
            branchName: data.branch?.name || "Unknown",
            semester: data.semester,
            classCoordinator: data.classCoordinator,
            profilePic: data.profilePic || null,
            classCoordinatorName: data.classCoordinatorName || "N/A",
            mailId: data.email,
            section: data.section || "N/A",
            batchNo: data.batchNumber || "N/A",
            gender: data.gender || "N/A",
            elective: {
              subject: data.elective?.subject || "N/A",
              credits: data.elective?.credits || 0,
            },
          };
          
          setStudent(fetchedStudent);
        } catch (err) {
          console.error("Error fetching student:", err);
        }
      };

      fetchStudent();
    }
  }, [id]);

  if (!id || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-5 text-gray-500 hover:text-gray-700"
          style={{ scale: "1.75" }}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-2">Student Details</h2>
        {student.profilePic && (
          <div className="mt-4 flex justify-center">
            <img
              src={student.profilePic}
              alt="Profile Picture"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
        )}
        <p className="mb-1">
          <strong>Name:</strong> {student.name}
        </p>
        <p className="mb-1">
          <strong>Registration Number:</strong> {student.registrationNo}
        </p>
        <p className="mb-1">
          <strong>Mobile Number 1:</strong> {student.mobileNo1}
        </p>
        <p className="mb-1">
          <strong>Mobile Number 2:</strong> {student.mobileNo2}
        </p>
        <p className="mb-1">
          <strong>Department:</strong> {student.departmentName}
        </p>
        <p className="mb-1">
          <strong>Branch:</strong> {student.branchName}
        </p>
        <p className="mb-1">
          <strong>Semester:</strong> {student.semester}
        </p>
        <p className="mb-1">
          <strong>Class Coordinator:</strong>{" "}
          {student.classCoordinator ? "Yes" : "No"}
        </p>
        <p className="mb-1">
          <strong>Class Coordinator Name:</strong>{" "}
          {student.classCoordinatorName}
        </p>
        <p className="mb-1">
          <strong>Email:</strong> {student.mailId}
        </p>
        <p className="mb-1">
          <strong>Section:</strong> {student.section}
        </p>
        <p className="mb-1">
          <strong>Batch Number:</strong> {student.batchNo}
        </p>
        <p className="mb-1">
          <strong>Gender:</strong> {student.gender}
        </p>

        <h3 className="text-lg font-semibold mt-4">Elective Details:</h3>
        <p className="mb-1">
          <strong>Subject:</strong> {student.elective.subject}
        </p>
        <p>
          <strong>Credits:</strong> {student.elective.credits}
        </p>
      </div>
    </div>
  );
}
