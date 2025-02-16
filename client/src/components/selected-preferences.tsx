import type { PreferenceSelection } from "../types/course";

interface SelectedPreferencesProps {
  preferences: PreferenceSelection[];
}

export function SelectedPreferences({ preferences }: SelectedPreferencesProps) {
  return (
    <div className="max-w-2xl mx-auto bg-orange-300 p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Your Registered Preferences</h2>
      {preferences.map((preference) => (
        <div
          key={preference.course.id}
          className="p-4 border bg-amber-100 rounded-lg mb-2"
        >
          <div className="font-medium">Preference {preference.preference}</div>
          <div className="text-sm  text-gray-500">
            {preference.course.courseCode} - {preference.course.name}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Semester: {preference.course.semester}
          </div>
        </div>
      ))}
    </div>
  );
}
