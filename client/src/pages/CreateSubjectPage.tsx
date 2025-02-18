import MainLayout from "../layouts/MainLayout.tsx";
import TextInputField from "../components/FormComponents/TextInputField.tsx";
import { useEffect, useState } from "react";
import {
  CourseCategory,
  useCourseCategories,
} from "../hooks/useCourseCategories.ts";
import SingleSelectMenu from "../components/FormComponents/SingleSelectMenu.tsx";
import ToggleWithDescription from "../components/FormComponents/ToggleWithDescription.tsx";
import { Department, useDepartments } from "../hooks/useDepartments.ts";
import MultiSelectMenuWithSearch from "../components/FormComponents/MultiSelectMenuWithSearch.tsx";
import useFetchCourses, { Course } from "../hooks/useFetchCourses.ts";
import useBranches, { Branch } from "../hooks/useBranches.ts";
import { CourseBucket, useCourseBuckets } from "../hooks/useCourseBuckets.ts";
import { AllotmentType, Semester } from "../types/course.ts";
import dayjs from "dayjs";
import { Batch } from "../types/UserTypes.ts";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import useCreateSubject from "../hooks/useCreateSubject.ts";
import { useNotification } from "../contexts/NotificationContext.tsx";
import PageHeader from "../components/PageHeader.tsx";
import { getBatches, getSemesters } from '../utils/generateObjectArrays.ts';

export default function CreateSubjectPage() {
  const { createSubject, isLoading, error, success } = useCreateSubject();

  const { notify } = useNotification();

  const semesters: Semester[] = getSemesters(8)
  const year = dayjs().year();

  const batches: Batch[] = getBatches(5,5)

  const [subjectName, setSubjectName] = useState("");
  const [department, setDepartment] = useState<Department | null>(null);
  const [courseCategory, setCourseCategory] = useState<CourseCategory | null>(
    null,
  );
  const [isOptableAcrossDepartment, setIsOptableAcrossDepartment] =
    useState<boolean>(false);
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
    null,
  );
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [selectedCourseBuckets, setSelectedCourseBuckets] = useState<
    CourseBucket[]
  >([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  const { courseCategories } = useCourseCategories();
  const { departments } = useDepartments();
  const { branches } = useBranches(isOptableAcrossDepartment, department);
  const { courses } = useFetchCourses(courseCategory, department);
  const { courseBuckets } = useCourseBuckets(department);
  const [selectedSemesters, setSelectedSemesters] = useState<Semester[]>([]);

  useEffect(() => {
    if (isOptableAcrossDepartment) {
      setDepartment(null);
    }
  }, [isOptableAcrossDepartment]);

  useEffect(() => {
    setSelectedBranches([]);
    setSelectedCourses([]);
    setSelectedCourseBuckets([]);
    setSelectedCourseBuckets([]);
  }, [department, isOptableAcrossDepartment]);

  const handleSubmit = async () => {
    if (
      !subjectName ||
      !courseCategory ||
      !selectedBatch ||
      selectedBranches.length === 0
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // Define the promise for subject creation
    const createSubjectPromise = createSubject(
      subjectName,
      selectedBatch.number,
      courseCategory,
      selectedBranches.map((branch) => branch.id),
      selectedCourses.map((course) => course.id),
      selectedCourseBuckets.map((bucket) => bucket.id),
      selectedSemesters.map((semester) => semester.number),
      selectedSemester ? selectedSemester.number : undefined,
      department ? department.id : undefined,
      isOptableAcrossDepartment,
    );

    // Use the notify function to show toast.promise
    notify(
      "promise",
      "Creating subject...",
      createSubjectPromise,
      "Failed to create subject",
    );
  };

  return (
    <MainLayout>
      <div className="p-8">
        <PageHeader title={"Create Subject"} />
        <div className={'mt-8 px-4'}>
          <div className="grid grid-cols-2 gap-32">
            <TextInputField
              value={subjectName}
              setValue={setSubjectName}
              label="Subject name"
              placeholder="Programme Elective - 3"
            />
            <SingleSelectMenu
              label="Category"
              items={courseCategories}
              selected={courseCategory}
              setSelected={setCourseCategory}
            />
          </div>
          <div className={"flex flex-row gap-32 my-12"}>
            <ToggleWithDescription
              enabled={isOptableAcrossDepartment}
              setEnabled={setIsOptableAcrossDepartment}
              title="Is Optable Across Department"
              description="Can students choose courses other than the ones offered by their Department?"
            />
            <div className={"w-full"}>
              {!isOptableAcrossDepartment && (
                <SingleSelectMenu
                  label="Department"
                  items={departments}
                  selected={department}
                  setSelected={setDepartment}
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-32">
            <MultiSelectMenuWithSearch
              label={"Branches"}
              items={branches}
              selected={selectedBranches}
              setSelected={setSelectedBranches}
            />
            {courseCategory?.allotmentType === AllotmentType.STANDALONE && (
              <MultiSelectMenuWithSearch
                label={"Courses"}
                items={courses}
                selected={selectedCourses}
                setSelected={setSelectedCourses}
              />
            )}
            {courseCategory?.allotmentType === AllotmentType.BUCKET && (
              <MultiSelectMenuWithSearch
                label={"Course Buckets"}
                items={courseBuckets}
                selected={selectedCourseBuckets}
                setSelected={setSelectedCourseBuckets}
              />
            )}
          </div>
          <div className={"flex w-full flex-row gap-32 mt-12"}>
            <div className={"w-full"}>
              {courseCategory?.allotmentType === AllotmentType.BUCKET && (
                <MultiSelectMenuWithSearch
                  label={"Semesters"}
                  items={semesters}
                  selected={selectedSemesters}
                  setSelected={setSelectedSemesters}
                />
              )}
              {courseCategory?.allotmentType === AllotmentType.STANDALONE && (
                <SingleSelectMenu
                  label={"Semester"}
                  items={semesters}
                  selected={selectedSemester}
                  setSelected={setSelectedSemester}
                />
              )}
            </div>
            <SingleSelectMenu
              label={"Batch"}
              items={batches}
              selected={selectedBatch}
              setSelected={setSelectedBatch}
            />
          </div>
          <div className={"flex w-full justify-end"}>
            <button
              onClick={handleSubmit}
              className={
                "bg-blue-500 mt-12 p-1.5 hover:bg-blue-400 text-white rounded-full flex items-center flex-row justify-between gap-4 pl-1 pr-6  w-min"
              }
            >
              <PlusCircleIcon className={"stroke-white w-8 h-8"} />
              <div className={"text-lg"}>Create</div>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
