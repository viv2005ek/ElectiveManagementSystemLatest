import { useState } from "react"
import { Search } from "lucide-react"
import type { Course, PreferenceSelection } from "../types/course"
import { CourseCard } from "./course-card"
import { SelectedPreferences } from "./selected-preferences"

// Sample data with more courses
const courses: Course[] = [
    {
      id: "123",
      courseCode: "CS101",
      name: "Introduction to Programming",
      semester: 1,
      isStandalone: true,
      minorSpecializationId: "12345",
    },
    {
      id: "124",
      courseCode: "CS102",
      name: "Data Structures",
      semester: 2,
      isStandalone: true,
      minorSpecializationId: "12345",
    },
    {
      id: "125",
      courseCode: "CS201",
      name: "Database Management Systems",
      semester: 3,
      isStandalone: true,
      minorSpecializationId: "12345",
    },
    {
      id: "126",
      courseCode: "CS202",
      name: "Operating Systems",
      semester: 3,
      isStandalone: true,
      minorSpecializationId: "12345",
    },
    {
      id: "127",
      courseCode: "CS301",
      name: "Software Engineering",
      semester: 4,
      isStandalone: true,
      minorSpecializationId: "12345",
    },
    {
      id: "128",
      courseCode: "CS302",
      name: "Computer Networks",
      semester: 4,
      isStandalone: true,
      minorSpecializationId: "12345",
    },
    {
      id: "129",
      courseCode: "CS401",
      name: "Artificial Intelligence",
      semester: 5,
      isStandalone: true,
      minorSpecializationId: "12345",
    },
    {
      id: "130",
      courseCode: "CS402",
      name: "Machine Learning",
      semester: 5,
      isStandalone: true,
      minorSpecializationId: "12345",
    },
    {
      id: "131",
      courseCode: "CS403",
      name: "Cloud Computing",
      semester: 6,
      isStandalone: true,
      minorSpecializationId: "12345",
    },
    {
      id: "132",
      courseCode: "CS404",
      name: "Cybersecurity",
      semester: 6,
      isStandalone: true,
      minorSpecializationId: "12345",
    },
    {
      id: "133",
      courseCode: "CS405",
      name: "Web Development",
      semester: 7,
      isStandalone: true,
      minorSpecializationId: "12345",
    },
    {
      id: "134",
      courseCode: "CS406",
      name: "Mobile App Development",
      semester: 7,
      isStandalone: true,
      minorSpecializationId: "12345",
    },
  ]

export function PreferenceSelection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [preferences, setPreferences] = useState<PreferenceSelection[]>([])
  const [isRegistered, setIsRegistered] = useState(false)

  const handleSelect = (course: Course) => {
    if (preferences.length >= 4) return
    if (preferences.some((p) => p.course.id === course.id)) {
      handleRemove(course.id)
    } else {
      setPreferences((prev) => [...prev, { preference: prev.length + 1, course }])
    }
  }

  const handleRemove = (courseId: string) => {
    setPreferences((prev) => prev.filter((p) => p.course.id !== courseId).map((p, index) => ({ ...p, preference: index + 1 })))
  }

  const handleRegister = () => {
    if (preferences.length === 4) {
      setIsRegistered(true)
      console.log("Registered preferences:", preferences)
    }
  }

  const filteredCourses = courses.filter(
    (course) => course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) || course.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isRegistered) {
    return <SelectedPreferences preferences={preferences} />
  }

  return (
    <div className="max-w-7xl mx-auto bg-orange-300 p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Select Your Programme elective Preferences</h2>

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

      {preferences.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium p-2  text-xl">Your Preferences</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {preferences.map((preference) => (
              <div key={preference.course.id} className="bg-amber-100 p-4 rounded-lg flex justify-between">
                <div>
                  <div className="font-medium">Preference {preference.preference}</div>
                  <div className="text-sm">{preference.course.courseCode}</div>
                  <div className="text-sm text-gray-500">{preference.course.name}</div>
                </div>
                <button className="text-red-500 font-bold text-sm" onClick={() => handleRemove(preference.course.id)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-medium p-3 text-xl">Available Courses</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCourses.map((course) => {
            const isSelected = preferences.some((p) => p.course.id === course.id)
            const preferenceNumber = preferences.find((p) => p.course.id === course.id)?.preference

            return (
              <CourseCard
                key={course.id}
                course={course}
                isSelected={isSelected}
                preferenceNumber={preferenceNumber}
                onSelect={() => handleSelect(course)}
                disabled={preferences.length >= 4 && !isSelected}
              />
            )
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
  )
}
