import { useState } from "react";
import MainLayout from "../../layouts/MainLayout.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { useNavigate } from "react-router-dom";
import useCreateProfessor from "../../hooks/professorHooks/useCreateProfessor.ts";
import useFetchDepartments from "../../hooks/departmentHooks/useFetchDepartments.ts";
// import useFetchProfessorRanks from "../../hooks/professorHooks/useFetchProfessorRanks.ts";

export default function ProfessorsCreate() {
  const navigate = useNavigate();
  const { createProfessor, loading } = useCreateProfessor();
  const { departments, loading: departmentsLoading } = useFetchDepartments();
//   const { professorRanks, loading: ranksLoading } = useFetchProfessorRanks();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    registrationNumber: "",
    departmentId: "",
    professorRankId: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProfessor(formData);
      navigate("/professors");
    } catch (error) {
      console.error("Failed to create professor:", error);
    }
  };

  return (
    <MainLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageHeader title="Add New Professor" />
        
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    required
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                    <div>
                  <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">
                    Department *
                  </label>
                  <select
                    id="departmentId"
                    name="departmentId"
                    required
                    value={formData.departmentId}
                    onChange={handleChange}
                    disabled={departmentsLoading}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} - {dept.school.name}
                      </option>
                    ))}
                  </select>
                  {departmentsLoading && (
                    <p className="mt-1 text-sm text-gray-500">Loading departments...</p>
                  )}
                </div>

             <div>
  <label htmlFor="professorRankId" className="block text-sm font-medium text-gray-700">
    Professor Rank *
  </label>
  <select
    id="professorRankId"
    name="professorRankId"
    required
    value={formData.professorRankId}
    onChange={handleChange}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  >
    <option value="">Select Rank</option>
    <option value="1">Professor (Priority: 1)</option>
    <option value="2">Associate Professor (Priority: 2)</option>
    <option value="3">Assistant Professor (Priority: 3)</option>
    <option value="4">Lecturer (Priority: 4)</option>
    <option value="5">Senior Lecturer (Priority: 5)</option>
    <option value="6">Visiting Professor (Priority: 6)</option>
    <option value="7">Adjunct Professor (Priority: 7)</option>
  </select>
</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/professors")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Professor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}