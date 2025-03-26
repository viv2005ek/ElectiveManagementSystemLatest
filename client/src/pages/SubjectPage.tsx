import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const subjects = [
  { id: 1, name: "Mathematics", maxStudents: 50, filledOutBy: 35, remaining: 15 },
  { id: 2, name: "Physics", maxStudents: 40, filledOutBy: 28, remaining: 12 },
  { id: 3, name: "Chemistry", maxStudents: 45, filledOutBy: 38, remaining: 7 },
  { id: 4, name: "Biology", maxStudents: 30, filledOutBy: 25, remaining: 5 },
];

export default function SubjectsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className={"py-8"}>
        <PageHeader title={"Subjects"} />
        <div className={"flex flex-row my-8 items-center justify-center"}>
          <div className={"flex flex-row gap-4 items-end"}>
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className={"flex flex-row flex-grow justify-end"}>
            <Link to={"/subjects/create"}>
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              >
                Add Subject
              </button>
            </Link>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 px-4 py-2">Subject Name</th>
              <th className="border border-gray-300 px-4 py-2">Max Students</th>
              <th className="border border-gray-300 px-4 py-2">Filled Out By</th>
              <th className="border border-gray-300 px-4 py-2">Remaining Students</th>
              <th className="border border-gray-300 px-4 py-2">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((subject) => (
              <tr key={subject.id} className="text-center border border-gray-300 hover:bg-gray-100 transition-all">
                <td className="border border-gray-300 px-4 py-2 text-gray-800 font-medium">{subject.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">{subject.maxStudents}</td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">{subject.filledOutBy}</td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">{subject.remaining}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-500 transition-all"
                    onClick={() => navigate(`/subjectReference`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
