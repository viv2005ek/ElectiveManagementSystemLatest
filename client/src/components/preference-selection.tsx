import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import type { Course, PreferenceSelection } from "../types/course";
import { CourseCard } from "./course-card";
import { SelectedPreferences } from "./selected-preferences";

const API_URL = "https://apiems.shreshth.tech/programme-electives/standalone";

export function PreferenceSelection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [preferences, setPreferences] = useState<PreferenceSelection[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data: Course[] = await response.json();
        setCourses(data);
      } catch (err) {
        setError("Error fetching courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle course selection
  const handleSelect = (course: Course) => {
    if (preferences.length >= 4) return;
    if (preferences.some((p) => p.course.id === course.id)) {
      handleRemove(course.id);
    } else {
      setPreferences((prev) => [...prev, { preference: prev.length + 1, course }]);
    }
  };

  // Remove selected course
  const handleRemove = (courseId: string) => {
    setPreferences((prev) =>
      prev.filter((p) => p.course.id !== courseId).map((p, index) => ({ ...p, preference: index + 1 }))
    );
  };

  // Register preferences
  const handleRegister = () => {
    if (preferences.length === 4) {
      setIsRegistered(true);
      console.log("Registered preferences:", preferences);
    }
  };

  // Filter courses based on search
  const filteredCourses = courses.filter(
    (course) =>
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isRegistered) {
    return <SelectedPreferences preferences={preferences} />;
  }

  return (
    <div className="max-w-7xl mx-auto bg-orange-300 p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Select Your Programme Elective Preferences</h2>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm z-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 border p-2 rounded-lg w-full z-1"
          />
        </div>
        <span className="text-sm text-black-500 font-medium">Selected: {preferences.length} of 4</span>
      </div>

      {loading && <p className="text-center text-gray-600 mt-4">Loading courses...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {preferences.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium p-2 text-xl">Your Preferences</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {preferences.map((preference) => (
              <div key={preference.course.id} className="bg-amber-100 p-4 rounded-lg flex justify-between">
                <div>
                  <div className="font-medium">Preference {preference.preference}</div>
                  <div className="text-sm">{preference.course.courseCode}</div>
                  <div className="text-sm text-gray-500">{preference.course.name}</div>
                </div>
                <button
                  className="text-red-500 font-bold text-sm"
                  onClick={() => handleRemove(preference.course.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-medium p-3 text-xl">Available Courses</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCourses.map((course) => {
            const isSelected = preferences.some((p) => p.course.id === course.id);
            const preferenceNumber = preferences.find((p) => p.course.id === course.id)?.preference;

            return (
              <CourseCard
                key={course.id}
                course={course}
                isSelected={isSelected}
                preferenceNumber={preferenceNumber}
                onSelect={() => handleSelect(course)}
                disabled={preferences.length >= 4 && !isSelected}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        {preferences.length < 4 && (
          <div className="bg-yellow-100 p-3 rounded-md text-sm">
            Please select {4 - preferences.length} more preference{preferences.length === 3 ? "" : "s"}.
          </div>
        )}
        <button
          className="w-full mt-4 bg-orange-600 font-medium text-white p-3 rounded-lg disabled:bg-gray-400"
          disabled={preferences.length !== 4}
          onClick={handleRegister}
        >
          Register Preferences
        </button>
      </div>
    </div>
  );
}
