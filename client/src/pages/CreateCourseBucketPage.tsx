import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";
import TextInputField from "../components/FormComponents/TextInputField.tsx";
import { useState } from "react";
import useFetchDepartments, {
  Department,
} from "../hooks/departmentHooks/useFetchDepartments.ts";
import SingleSelectMenuWithSearch from "../components/FormComponents/SingleSelectMenuWithSearch.tsx";
import useFetchSubjectTypes, {
  AllotmentType,
  SubjectType,
} from "../hooks/subjectTypeHooks/useFetchSubjectTypes.ts";
import MultiSelectMenu from "../components/FormComponents/MultiSelectMenu.tsx";
import NumberInputField from "../components/FormComponents/NumberInputField.tsx";
import useFetchCourses from "../hooks/courseHooks/useFetchCourses.ts";
import SearchBarWithDebounce from "../components/SearchBarWithDebounce.tsx";
import CoursesMultiSelectTable from "../components/tables/CoursesMultiSelectTable.tsx";
import useCreateCourseBucket from "../hooks/courseBucketHooks/useCreateCourseBucket.ts";

export interface CourseWithOrder {
  id: string;
  orderIndex: number;
}

export default function CreateCourseBucketPage() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<Department | null>(null);
  const [selectedSubjectTypes, setSelectedSubjectTypes] = useState<
    SubjectType[]
  >([]);
  const [numberOfCourses, setNumberOfCourses] = useState<number | undefined>();
  const [selectedCourses, setSelectedCourses] = useState<CourseWithOrder[]>([]);
  const [search, setSearch] = useState("");

  const { departments } = useFetchDepartments();
  const { subjectTypes } = useFetchSubjectTypes({
    allotmentType: AllotmentType.BUCKET,
  });
  const { courses, loading } = useFetchCourses({ department, search });

  const { addCourseBucket } = useCreateCourseBucket();

  const handleSubmit = async () => {
    await addCourseBucket({
      name,
      departmentId: department?.id,
      numberOfCourses,
      subjectTypeIds: subjectTypes.map((type) => type.id),
      courses: selectedCourses.map((course) => ({
        id: course.id,
        orderIndex: course.orderIndex,
      })),
    });
  };

  return (
    <MainLayout>
      <div className="py-8">
        <PageHeader title={"Create Course-Bucket"} />
        <div className={"grid grid-cols-2 gap-x-32 gap-y-12 mt-8"}>
          <TextInputField label={"Name"} value={name} setValue={setName} />
          <SingleSelectMenuWithSearch
            label={"Department"}
            items={departments}
            selected={department}
            setSelected={setDepartment}
          />
          <MultiSelectMenu
            label={"Subject Types"}
            items={subjectTypes}
            selected={selectedSubjectTypes}
            setSelected={setSelectedSubjectTypes}
          />
          <NumberInputField
            label={"Number of Courses in a Bucket"}
            value={numberOfCourses}
            setValue={setNumberOfCourses}
          />
        </div>
        <div className={"mt-12"}>
          <div className={"my-2  font-semibold text-sm"}>Courses included</div>
          <SearchBarWithDebounce value={search} setValue={setSearch} />
          <CoursesMultiSelectTable
            maxSelection={numberOfCourses}
            courses={courses}
            selectedCourses={selectedCourses}
            setSelectedCourses={setSelectedCourses}
            isLoading={loading}
          />
        </div>
        <button
          onClick={handleSubmit}
          className={
            "bg-blue-300 rounded-lg text-white hover:bg-blue-200 mt-8 font-semibold w-full p-2"
          }
        >
          Create
        </button>
      </div>
    </MainLayout>
  );
}
