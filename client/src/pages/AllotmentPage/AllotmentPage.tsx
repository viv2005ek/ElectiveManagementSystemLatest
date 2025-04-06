import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import MainLayout from "../../layouts/MainLayout";

type Subject = {
  id: string;
  name: string;
  status: string;
};

type AllotmentResponse = {
  name: string;
  subjectType: {
    name: string;
    allotmentType: string;
  };
  batch: string;
  standaloneAllotments: {
    student: {
      firstName: string;
      lastName: string;
    };
    course: {
      name: string;
    };
  }[];
  bucketAllotments: {
    student: {
      firstName: string;
      lastName: string;
    };
    courseBucket: {
      name: string;
    };
  }[];
};

export default function AllotmentPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [allotments, setAllotments] = useState<AllotmentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axiosInstance.get("/subjects");
        setSubjects((res.data.subjects || []));
      } catch (err) {
        console.error(" Error fetching subjects", err);
        setError("Failed to load subjects.");
      }
    };
    fetchSubjects();
  }, []);

  const fetchAllotments = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/subjects/${id}/allotments`);
      setAllotments(res.data);
    } catch (err) {
      console.error(" Error fetching allotments", err);
      setError("Allotments not found or failed to fetch.");
      setAllotments(null);
    } finally {
      setLoading(false);
    }
  };

  const runAllotment = async () => {
    if (!selectedSubjectId) return;
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post(`/subjects/${selectedSubjectId}/allotments`);
      await fetchAllotments(selectedSubjectId);
    } catch (err) {
      console.error("Error running allotment", err);
      setError("Failed to run allotment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSubjectId) {
      fetchAllotments(selectedSubjectId);
    }
  }, [selectedSubjectId]);

  return (
    <MainLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Allotment Viewer</h1>

        <div>
          <label className="block mb-2 font-medium text-sm">Select a Subject:</label>
          <select
            className="border rounded p-2 w-full"
            value={selectedSubjectId || ""}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
          >
            <option value="">-- Choose a subject --</option>
            {subjects.map((subj) => (
              <option key={subj.id} value={subj.id}>
                {subj.name}
              </option>
            ))}
          </select>
        </div>

        {selectedSubjectId && (
          <button
            onClick={runAllotment}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
          >
            Run Allotment
          </button>
        )}

        {loading && <p>Loading...</p>}

        {error && (
          <p className="text-red-600 font-medium">
            ⚠️ {error}
          </p>
        )}

        {!loading && allotments && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Allotments for {allotments.name} ({allotments.subjectType.name})
            </h2>

            {allotments.standaloneAllotments.length > 0 && (
              <div>
                <h3 className="font-medium text-lg mb-2">Standalone Allotments</h3>
                <ul className="space-y-2">
                  {allotments.standaloneAllotments.map((entry, idx) => (
                    <li key={idx} className="border p-2 rounded shadow-sm">
                      <strong>
                        {entry.student.firstName} {entry.student.lastName}
                      </strong>{" "}
                      → {entry.course.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {allotments.bucketAllotments.length > 0 && (
              <div>
                <h3 className="font-medium text-lg mb-2">Bucket Allotments</h3>
                <ul className="space-y-2">
                  {allotments.bucketAllotments.map((entry, idx) => (
                    <li key={idx} className="border p-2 rounded shadow-sm">
                      <strong>
                        {entry.student.firstName} {entry.student.lastName}
                      </strong>{" "}
                      → {entry.courseBucket.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
