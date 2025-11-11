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
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    if (id) {
      setValidationError(null);
      await fillPreferences(id, queue);
    }
  };

  // Slideable queue functions
  const scrollLeft = () => {
    const container = document.getElementById('preferences-queue');
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('preferences-queue');
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
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
      <div className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="mt-4 sm:mt-6 lg:mt-8">
          <PageHeader
            title={"Subject Preferences"}
            description={`Fill out your preferences for the subject ${offerings?.subjectName} of batch ${offerings?.batchName}`}
          />
        </div>
        
        {/* Search Bar */}
        <div className="mt-4 sm:mt-6">
          <SearchBarWithDebounce 
            value={search} 
            setValue={setSearch} 
            placeholder="Search courses or buckets..."
          />
        </div>

        {/* Course Offerings */}
        {offerings?.courses && offerings?.courses.length !== 0 && (
          <div className="mt-6">
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
          </div>
        )}

        {/* Course Bucket Offerings */}
        {offerings?.courseBuckets && offerings?.courseBuckets.length !== 0 && (
          <div className="mt-6">
            <CourseBucketOfferingsTable
              courseBuckets={offerings?.courseBuckets}
              totalPages={offerings?.totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              isLoading={loading}
              handleAddToQueue={handleAddToQueue}
              queue={queue}
            />
          </div>
        )}

        {/* No Offerings Message */}
        {(!offerings?.courses || offerings.courses.length === 0) && 
         (!offerings?.courseBuckets || offerings.courseBuckets.length === 0) && (
          <div className="mt-8 text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg font-medium">No offerings available</p>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Slideable Preferences Queue */}
        {queue.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Preferences ({queue.length}/{size})
              </h3>
              {queue.length > 2 && (
                <div className="flex space-x-2">
                  <button
                    onClick={scrollLeft}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={scrollRight}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Slideable Container */}
            <div className="relative">
              {/* Scrollable Container */}
              <div
                id="preferences-queue"
                className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {queue.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-64 snap-start bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        Priority {index + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveFromQueue(item.id!)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 rounded"
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {item.name}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="truncate">
                        {offerings?.courses?.find(c => c.id === item.id) ? 'Course' : 'Bucket'}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Empty slots for visual indication */}
                {Array.from({ length: size - queue.length }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="flex-shrink-0 w-64 snap-start bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <svg className="h-8 w-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="text-sm text-gray-500">Empty Slot</p>
                      <p className="text-xs text-gray-400">Priority {queue.length + index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gradient overlays for scroll indication */}
              <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>

            {/* Mobile indicator */}
            <div className="mt-2 text-center sm:hidden">
              <p className="text-xs text-gray-500">Swipe to see all preferences</p>
            </div>
          </div>
        )}

        {/* Empty Queue State */}
        {queue.length === 0 && (
          <div className="mt-6 sm:mt-8 text-center py-8 bg-gray-50 rounded-lg">
            <div className="max-w-md mx-auto">
              <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No preferences selected</h3>
              <p className="text-gray-500">Add courses or buckets from the lists above to create your preference list.</p>
            </div>
          </div>
        )}

        {/* Validation Error */}
        {validationError && (
          <div className="bg-red-100 text-red-700 text-center p-3 sm:p-4 mb-4 rounded-lg mt-4">
            {validationError}
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6 sm:mt-8">
          <button
            onClick={handleSubmit}
            disabled={loading || queue.length === 0}
            className={`
              w-full sm:w-auto min-w-[200px] px-6 py-3 
              bg-blue-500 text-white rounded-lg 
              hover:bg-blue-400 transition-colors duration-200
              disabled:bg-blue-300 disabled:cursor-not-allowed
              font-medium text-base
              flex items-center justify-center
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              "Update Preferences"
            )}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}