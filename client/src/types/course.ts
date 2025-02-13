export interface Course {
  id: string;
  courseCode: string;
  name: string;
  semester: number;
  isStandalone: boolean;
  minorSpecializationId: string;
}

export interface PreferenceSelection {
  preference: number;
  course: Course;
}
