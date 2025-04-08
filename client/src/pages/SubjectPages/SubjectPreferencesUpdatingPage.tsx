import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import useFetchSubjectOfferings from "../../hooks/subjectHooks/useFetchSubjectOfferings.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CourseOfferingsTable from "../../components/tables/CourseOfferingsTable.tsx";
import CourseBucketOfferingsTable from "../../components/tables/CourseBucketOfferingsTable.tsx";
import PreferencesList from "../../components/FormComponents/PreferencesList.tsx";
import SearchBarWithDebounce from "../../components/SearchBarWithDebounce.tsx";
import { useCreateSubjectPreferences } from "../../hooks/subjectPreferenceHooks/useCreateSubjectPreferences.ts";
import useStudentsSubjectPreferences from "../../hooks/subjectPreferenceHooks/useStudentsSubjectPreferences.ts";

export class T {
  id: string | undefined;
  name: string | undefined;
}

export default function SubjectPreferencesUpdatingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { offerings } = useFetchSubjectOfferings(id || "", currentPage, search);

  const { fillPreferences, success, loading } = useCreateSubjectPreferences();

  const { preferences } = useStudentsSubjectPreferences(id);

  const [queue, setQueue] = useState<T[]>([]);

  const size = 3;

  const enqueue = (item: T) => {
    setQueue((prev) => {
      const updatedQueue = [...prev, item];
      if (updatedQueue.length > size) {
        updatedQueue.shift(); // Remove oldest element if queue exceeds size
      }
      return updatedQueue;
    });
  };

  const handleAddToQueue = (item: T) => {
    if (queue.length < size) {
      enqueue(item);
    }
  };

  const handleRemoveFromQueue = async (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    // if (queue.length !== 3) {
    //   setValidationError("You need to add all three preferences.");
    //   return;
    // }
    if (id) {
      setValidationError(null);
      await fillPreferences(id, queue);
    }
  };

  useEffect(() => {
    if (success) {
      navigate("/home");
    }
  }, [success]);

  useEffect(() => {
    setQueue(preferences);
  }, [preferences]);

  return (
    <MainLayout>
      <div className={"mt-8"}>
        <PageHeader
          title={"Subject Preferences"}
          description={`Fill out your preferences for the subject ${offerings?.subjectName} of batch ${offerings?.batchName}`}
        />
      </div>
      <div className={"mt-6"}>
        <SearchBarWithDebounce value={search} setValue={setSearch} />
      </div>

      {offerings?.courses && offerings?.courses.length !== 0 && (
        <>
          <CourseOfferingsTable
            courses={offerings?.courses}
            courseBuckets={offerings?.courseBuckets}
            totalPages={offerings?.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isLoading={loading}
            handleAddToQueue={handleAddToQueue}
            queue={queue}
          />
        </>
      )}
      {offerings?.courseBuckets && offerings?.courseBuckets.length !== 0 && (
        <>
          <CourseBucketOfferingsTable
            courseBuckets={offerings?.courseBuckets}
            totalPages={offerings?.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isLoading={loading}
            handleAddToQueue={handleAddToQueue}
            queue={queue}
          />
        </>
      )}
      <PreferencesList
        handleRemove={handleRemoveFromQueue}
        queue={queue}
        size={size}
      />
      {validationError && (
        <div
          className={"bg-red-100 text-red-700 text-center p-2 mb-4 rounded-lg"}
        >
          {validationError}
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={
          "bg-blue-500 p-2 w-full text-white rounded-lg mb-8 mt-4 hover:bg-blue-400"
        }
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </MainLayout>
  );
}
