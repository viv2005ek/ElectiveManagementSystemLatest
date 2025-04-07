import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance.ts";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Search, RefreshCw, AlertCircle } from "lucide-react";
import useRunAllotment from "../../hooks/subjectHooks/useRunAllotment.ts";

type Course = {
  id: string;
  name: string;
};

type StandalonePreference = {
  student: {
    firstName: string;
    lastName: string;
  };
  firstPreferenceCourse: Course;
  secondPreferenceCourse: Course;
  thirdPreferenceCourse: Course;
};

type BucketPreference = {
  student: {
    firstName: string;
    lastName: string;
  };
  firstPreferenceCourseBucket: Course;
  secondPreferenceCourseBucket: Course;
  thirdPreferenceCourseBucket: Course;
};

type SubjectPreferenceResponse = {
  name: string;
  subjectType: {
    allotmentType: "Standalone" | "Bucket";
  };
  batch: {
    id: string;
    year: number;
  };
  standaloneSubjectPreferences: StandalonePreference[];
  bucketSubjectPreferences: BucketPreference[];
};

export default function SubjectPreferencesPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<SubjectPreferenceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showAllDetails, setShowAllDetails] = useState(false);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/subject-preferences/${id}`);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching preferences:", err);
    } finally {
      setLoading(false);
    }
  };

  const { runAllotment, loading: allotmentLoading } = useRunAllotment({
    onSuccess: () => {
      fetchPreferences();
      alert("Allotment process completed successfully.");
    },
    onError: (errorMsg) => {
      alert(`Failed to run allotment: ${errorMsg}`);
    }
  });
  const handleRunAllotment = () => {
    if (!id) return;
    runAllotment({ subjectId: id });
  };

  useEffect(() => {
    if (id) fetchPreferences();
  }, [id]);

  const handleToggle = (index: number) => {
    if (showAllDetails) return;
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const toggleAllDetails = () => {
    setShowAllDetails(!showAllDetails);
    setExpandedIndex(null);
  };

  const filterPreferences = <T extends { student: { firstName: string; lastName: string } }>(
    preferences: T[]
  ): T[] => {
    return preferences.filter((pref) =>
      `${pref.student.firstName} ${pref.student.lastName}`.toLowerCase().includes(search.toLowerCase())
    );
  };

  const getCurrentPreferences = () => {
    if (!data) return [];
    
    if (data.subjectType.allotmentType === "Standalone") {
      return data.standaloneSubjectPreferences;
    } else {
      return data.bucketSubjectPreferences;
    }
  };

  const getFilteredPreferences = () => {
    const currentPreferences = getCurrentPreferences();
    if (data?.subjectType.allotmentType === "Standalone") {
      return filterPreferences(currentPreferences as StandalonePreference[]);
    } else {
      return filterPreferences(currentPreferences as BucketPreference[]);
    }
  };

  const renderStandalonePreferenceDetails = (preference: StandalonePreference) => {
    const items = [
      {
        number: 1,
        label: preference.firstPreferenceCourse.name,
        bgColor: "bg-blue-200",
        textColor: "text-blue-800"
      },
      {
        number: 2,
        label: preference.secondPreferenceCourse.name,
        bgColor: "bg-blue-100",
        textColor: "text-blue-700"
      },
      {
        number: 3,
        label: preference.thirdPreferenceCourse.name,
        bgColor: "bg-gray-100",
        textColor: "text-gray-700"
      }
    ];
    

    return (
      <div className="px-4 pb-4 pt-1 pl-16 bg-blue-50 rounded-b-lg transition-all duration-300 ease-in-out">
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center group hover:bg-white hover:bg-opacity-50 p-2 rounded-lg transition-all">
              <div className={`w-8 h-8 rounded-full ${item.bgColor} flex items-center justify-center ${item.textColor} font-bold mr-3 shadow-sm`}>
                {item.number}
              </div>
              <span className="text-gray-700 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBucketPreferenceDetails = (preference: BucketPreference) => {
    const items = [
      {
        number: 1,
        label: preference.firstPreferenceCourseBucket.name,
        bgColor: "bg-emerald-200",
        textColor: "text-emerald-800"
      },
      {
        number: 2,
        label: preference.secondPreferenceCourseBucket.name,
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-700"
      },
      {
        number: 3,
        label: preference.thirdPreferenceCourseBucket.name,
        bgColor: "bg-gray-100",
        textColor: "text-gray-700"
      }
    ];

    return (
      <div className="px-4 pb-4 pt-1 pl-16 bg-green-50 rounded-b-lg transition-all duration-300 ease-in-out">
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center group hover:bg-white hover:bg-opacity-50 p-2 rounded-lg transition-all">
              <div className={`w-8 h-8 rounded-full ${item.bgColor} flex items-center justify-center ${item.textColor} font-bold mr-3 shadow-sm`}>
                {item.number}
              </div>
              <span className="text-gray-700 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <PageHeader title="Subject Preferences" />
        
        {data && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500 transition-all hover:shadow-lg">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{data.name}</h2>
                <div className="flex flex-wrap mt-3 gap-3">
                  <div className="flex items-center">
                    <span className="font-semibold mr-2 text-gray-600">Batch Year:</span> 
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md font-medium">{data.batch.year}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2 text-gray-600">Allotment Type:</span> 
                    <span className={`px-3 py-1 rounded-md font-medium ${
                      data.subjectType.allotmentType === "Standalone" 
                        ? "bg-purple-100 text-purple-800" 
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {data.subjectType.allotmentType}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-sm text-gray-500 mb-2 flex items-center">
                  <span className="font-medium">Total Students:</span>
                  <span className="ml-2 bg-gray-100 px-3 py-1 rounded-md font-bold text-gray-700">
                    {getCurrentPreferences().length}
                  </span>
                </div>
                
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-auto flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students by name..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={toggleAllDetails}
              className={`px-4 py-2.5 rounded-lg border ${
                showAllDetails 
                  ? "border-blue-500 bg-blue-50 text-blue-600" 
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              } flex items-center gap-2 transition-all shadow-sm`}
            >
              {showAllDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span>{showAllDetails ? "Collapse All" : "Expand All"}</span>
            </button>
            <button 
              onClick={fetchPreferences}
              className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button 
    className="px-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2 transition-all shadow-sm"  
    onClick={handleRunAllotment} 
    disabled={loading || allotmentLoading}>
    Run Allotment
  </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading student preferences...</p>
            </div>
          </div>
        ) : data ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-gray-50 p-5 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    {data.subjectType.allotmentType === "Standalone" 
                      ? "Standalone Preferences" 
                      : "Bucket Preferences"}
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      data.subjectType.allotmentType === "Standalone" 
                        ? "bg-purple-100 text-purple-800" 
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {getCurrentPreferences().length} students
                    </span>
                  </h3>
                  {getFilteredPreferences().length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Showing {getFilteredPreferences().length} student preferences
                      {search && <span> matching "{search}"</span>}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {data.subjectType.allotmentType === "Standalone" ? (
                filterPreferences(data.standaloneSubjectPreferences).length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">No preferences found</p>
                    <p className="text-sm max-w-md mx-auto">Try adjusting your search criteria or check if students have submitted preferences for this subject</p>
                  </div>
                ) : (
                  filterPreferences(data.standaloneSubjectPreferences).map((pref, index) => (
                    <div key={index} className="transition-all">
                      <div
                        className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 ${
                          expandedIndex === index || showAllDetails ? "bg-blue-50 border-b border-blue-100" : ""
                        }`}
                        onClick={() => handleToggle(index)}
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full  flex items-center justify-center mr-3 font-medium shadow-sm">
                            {index + 1}
                          </div>
                          <p className="font-medium text-gray-800">
                            {pref.student.firstName} {pref.student.lastName}
                          </p>
                        </div>
                        {!showAllDetails && (
                          <div className={`h-6 w-6 text-gray-500 transition-transform duration-200 ${
                            expandedIndex === index ? "transform rotate-180" : ""
                          }`}>
                            <ChevronDown />
                          </div>
                        )}
                      </div>
                      {(expandedIndex === index || showAllDetails) && renderStandalonePreferenceDetails(pref)}
                    </div>
                  ))
                )
              ) : (
                filterPreferences(data.bucketSubjectPreferences).length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">No preferences found</p>
                    <p className="text-sm max-w-md mx-auto">Try adjusting your search criteria or check if students have submitted preferences for this subject</p>
                  </div>
                ) : (
                  filterPreferences(data.bucketSubjectPreferences).map((pref, index) => (
                    <div key={index} className="transition-all">
                      <div
                        className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 ${
                          expandedIndex === index || showAllDetails ? "bg-green-50 border-b border-green-100" : ""
                        }`}
                        onClick={() => handleToggle(index)}
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 font-medium shadow-sm">
                            {index + 1}
                          </div>
                          <p className="font-medium text-gray-800">
                            {pref.student.firstName} {pref.student.lastName}
                          </p>
                        </div>
                        {!showAllDetails && (
                          <div className={`h-6 w-6 text-gray-500 transition-transform duration-200 ${
                            expandedIndex === index ? "transform rotate-180" : ""
                          }`}>
                            <ChevronDown />
                          </div>
                        )}
                      </div>
                      {(expandedIndex === index || showAllDetails) && renderBucketPreferenceDetails(pref)}
                    </div>
                  ))
                )
              )}
            </div>

            {getFilteredPreferences().length > 0 && (
              <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {getFilteredPreferences().length} students
                </span>
                <div className="flex space-x-1">
                  <button disabled className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-400 text-sm">Previous</button>
                  <button className="px-3 py-1 rounded border border-blue-500 bg-blue-50 text-blue-700 text-sm font-medium">1</button>
                  <button disabled className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-400 text-sm">Next</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 bg-red-50 rounded-lg border border-red-200 text-center">
            <AlertCircle className="h-10 w-10 mx-auto mb-3 text-red-500" />
            <p className="text-red-600 font-medium text-lg mb-1">Failed to load subject preferences</p>
            <p className="text-red-500 text-sm mb-4">Please check your connection and try again</p>
            <button 
              onClick={fetchPreferences}
              className="px-4 py-2 bg-white border border-red-300 rounded-md text-red-600 hover:bg-red-50 text-sm font-medium transition-all shadow-sm"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}