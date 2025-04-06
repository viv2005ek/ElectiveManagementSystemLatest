import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance.ts";
import MainLayout from "../../layouts/MainLayout";

type Batch = {
  id: string;
  year: number;
};

type Subject = {
  id: string;
  name: string;
  dueDate: string;
  isPreferenceWindowOpen: boolean;
  isAllotmentFinalized: boolean;
  batch: Batch;
  totalStudents: number;
  preferencesFilled: number;
  remainingStudents: number;
};

export default function PreferencePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/subjects");
      setSubjects(res.data.subjects);
    } catch (err) {
      console.error("Error fetching subjects", err);
    } finally {
      setLoading(false);
    }
  };

  const runAllotment = async (subjectId: string) => {
    const confirmRun = confirm(
      `Are you sure you want to run and finalize the allotment? ${subjectId}`,
    );
    if (!confirmRun) return;

    try {
      await axiosInstance.post(`/subjects/${subjectId}/allotments`);
      alert("Allotment run and finalized successfully!");
      fetchSubjects();
    } catch (err) {
      console.error("Error running or finalizing allotment", err);
      alert("Failed to run or finalize allotment.");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <MainLayout>
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Subject Preferences</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          subjects.map((subject) => (
            <div
              key={subject.id}
              className="border rounded-lg shadow-md p-4 space-y-2 bg-white"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{subject.name}</h2>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    subject.isPreferenceWindowOpen
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {subject.isPreferenceWindowOpen
                    ? "Preference Open"
                    : "Closed"}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                Batch: {subject.batch.year}
              </p>
              <p className="text-sm text-gray-600">
                Due Date: {new Date(subject.dueDate).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Preferences Filled: {subject.preferencesFilled} /{" "}
                {subject.totalStudents}
              </p>
              <p className="text-sm text-gray-600">
                Allotment Finalized:{" "}
                <span
                  className={`font-semibold ${
                    subject.isAllotmentFinalized
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {subject.isAllotmentFinalized ? "Yes" : "No"}
                </span>
              </p>

              <button
                className="mt-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 border-rounded"
                disabled={
                  subject.isAllotmentFinalized ||
                  !subject.isPreferenceWindowOpen
                }
                onClick={() => runAllotment(subject.id)}
              >
                Run Allotment
              </button>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
}
