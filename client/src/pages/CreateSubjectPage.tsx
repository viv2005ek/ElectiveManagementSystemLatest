import MainLayout from '../layouts/MainLayout.tsx';
import TextInputField from '../components/FormComponents/TextInputField.tsx';
import { useState } from 'react';
import { CourseCategory, useCourseCategories } from '../hooks/useCourseCategories.ts';
import SingleSelectMenu from '../components/FormComponents/SingleSelectMenu.tsx';
import ToggleWithDescription from '../components/FormComponents/ToggleWithDescription.tsx';
import { Department, useDepartments } from '../hooks/useDepartments.ts';
import { Branch, useBranches } from '../hooks/useBranches.ts';
import MultiSelectMenuWithSearch from '../components/FormComponents/MultiSelectMenuWithSearch.tsx';
import useFetchCourses, {Course} from '../hooks/useFetchCourses.ts';

export default function CreateSubjectPage () {

  const [subjectName, setSubjectName] = useState("");
  const [department, setDepartment] = useState<Department | null>(null);
  const [courseCategory, setCourseCategory] = useState<CourseCategory | null>(null);
  const [isOptableAcrossDepartment, setIsOptableAcrossDepartment] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const {courseCategories} = useCourseCategories()
  const {departments} = useDepartments()
  const {branches} = useBranches()
  const {courses} = useFetchCourses(courseCategory?.id)


  return (
    <MainLayout>
      <div className="p-8">
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
        <div className={'flex flex-row gap-32 my-12'}>
          <ToggleWithDescription
            enabled={isOptableAcrossDepartment}
            setEnabled={setIsOptableAcrossDepartment}
            title="Is Optable Across Department"
            description="Can students choose courses other than the ones offered by their Department?"
          />
          <div className={'w-full'}>
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
          <MultiSelectMenuWithSearch label={"Branches"} items={branches} selected={selectedBranches} setSelected={setSelectedBranches} />
          <MultiSelectMenuWithSearch label={"Courses"} items={courses} selected={selectedCourses} setSelected={setSelectedCourses} />
        </div>
      </div>
    </MainLayout>
  );

}
