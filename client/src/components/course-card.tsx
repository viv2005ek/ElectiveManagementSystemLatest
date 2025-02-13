import type { Course } from '../types/course';

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  preferenceNumber?: number;
  onSelect: () => void;
  disabled: boolean;
}

export function CourseCard({
  course,
  isSelected,
  preferenceNumber,
  onSelect,
  disabled,
}: CourseCardProps) {
  return (
    <div
      className={`p-4 bg-amber-100 border rounded-lg cursor-pointer transition-all relative 
        ${isSelected ? "ring-2 ring-orange-500" : disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
      `}
      onClick={() => !disabled && onSelect()}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold">
          {preferenceNumber}
        </div>
      )}
      <div className="space-y-2">
        <div className="font-medium">{course.courseCode}</div>
        <div className="text-sm text-grey-500 font-medium">{course.name}</div>
        <div className="text-sm  font-medium">Semester {course.semester}</div>
      </div>
    </div>
  );
}
