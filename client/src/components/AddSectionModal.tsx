import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import useProfessors from "../hooks/sectionHooks/useProfessors";
import useSubjectCourses from "../hooks/sectionHooks/useSubjectCourses";
import axiosInstance from "../axiosInstance.ts";
import { debounce } from "lodash";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
  onSuccess: () => void;
}

export default function AddSectionModal({
  isOpen,
  onClose,
  subjectId,
  onSuccess,
}: AddSectionModalProps) {
  const [name, setName] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(
    null,
  );
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: professors, isLoading: professorsLoading } =
    useProfessors(searchTerm);
  const { data: courses, isLoading: coursesLoading } =
    useSubjectCourses(subjectId);

  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedProfessor || !selectedCourse) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await axiosInstance.post("/elective-sections", {
        name,
        professorId: selectedProfessor,
        subjectCourseWithSeatsId: selectedCourse,
        courseId: courses?.find((c) => c.id === selectedCourse)?.course.id,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProfessorDetails = professors?.find(
    (p) => p.id === selectedProfessor,
  );

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900 mb-4"
                    >
                      Add New Section
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Section Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter section name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="professor-search"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Search Professor
                        </label>
                        <div className="mt-1 relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="text"
                            name="professor-search"
                            id="professor-search"
                            onChange={handleSearchChange}
                            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Search by name, email, or registration number"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Professor
                        </label>
                        <div className="max-h-40 overflow-y-auto border rounded-md">
                          {professorsLoading ? (
                            <div className="p-4 text-center text-gray-500">
                              Loading professors...
                            </div>
                          ) : professors?.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              No professors found
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-200">
                              {professors?.map((professor) => (
                                <div
                                  key={professor.id}
                                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                                    selectedProfessor === professor.id
                                      ? "bg-indigo-50"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    setSelectedProfessor(professor.id)
                                  }
                                >
                                  <div className="font-medium">
                                    {professor.firstName} {professor.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {professor.professorRank.name} •{" "}
                                    {professor.department.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {professor.email} •{" "}
                                    {professor.registrationNumber}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="course"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Select Course
                        </label>
                        <div className="max-h-40 overflow-y-auto border rounded-md">
                          {coursesLoading ? (
                            <div className="p-4 text-center text-gray-500">
                              Loading courses...
                            </div>
                          ) : courses?.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              No courses available
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-200">
                              {courses?.map((course) => (
                                <div
                                  key={course.id}
                                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                                    selectedCourse === course.id
                                      ? "bg-indigo-50"
                                      : ""
                                  }`}
                                  onClick={() => setSelectedCourse(course.id)}
                                >
                                  <div className="font-medium">
                                    {course.course.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Code: {course.course.code} • Credits:{" "}
                                    {course.course.credits}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Available Seats: {course.availableSeats} /{" "}
                                    {course.totalSeats}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedProfessorDetails && (
                        <div className="bg-gray-50 p-3 rounded-md">
                          <h4 className="text-sm font-medium text-gray-900">
                            Selected Professor Details
                          </h4>
                          <dl className="mt-2 text-sm text-gray-500">
                            <div className="flex justify-between">
                              <dt>Department:</dt>
                              <dd>
                                {selectedProfessorDetails.department.name}
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt>School:</dt>
                              <dd>
                                {
                                  selectedProfessorDetails.department.school
                                    .name
                                }
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt>Rank:</dt>
                              <dd>
                                {selectedProfessorDetails.professorRank.name}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      )}

                      {error && (
                        <div className="rounded-md bg-red-50 p-4">
                          <div className="text-sm text-red-700">{error}</div>
                        </div>
                      )}

                      <div className="mt-4 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                          {isSubmitting ? "Creating..." : "Create Section"}
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
