import MainLayout from "../../layouts/MainLayout.tsx";
import useFetchProfessors from "../../hooks/professorHooks/useFetchProfessors.ts";
import ProfessorsTable from "../../components/tables/ProfessorsTable.tsx";
import { useState, useEffect } from "react";
import SearchBarWithDebounce from "../../components/SearchBarWithDebounce.tsx";
import PageHeader from "../../components/PageHeader.tsx";
import { Link } from "react-router-dom";
import axiosInstance from "../../axiosInstance.ts";

interface ProfessorRank {
  id: string;
  name: string;
  priority: number;
}

export default function ProfessorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRankModal, setShowRankModal] = useState(false);
  const [professorRanks, setProfessorRanks] = useState<ProfessorRank[]>([]);
  const [loadingRanks, setLoadingRanks] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    priority: ""
  });
  const [editingRank, setEditingRank] = useState<ProfessorRank | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { professors, totalPages, loading } = useFetchProfessors({
    search: searchQuery,
    page: currentPage,
  });

  // Fetch professor ranks when modal opens
  useEffect(() => {
    if (showRankModal) {
      fetchProfessorRanks();
    }
  }, [showRankModal]);

  const fetchProfessorRanks = async () => {
    setLoadingRanks(true);
    try {
      const response = await axiosInstance.get("/professor-ranks");
      setProfessorRanks(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to fetch professor ranks:", error);
    } finally {
      setLoadingRanks(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateRank = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axiosInstance.post("/professor-ranks", {
        name: formData.name,
        priority: parseInt(formData.priority)
      });
      
      // Reset form and refresh list
      setFormData({ name: "", priority: "" });
      await fetchProfessorRanks();
    } catch (error) {
      console.error("Failed to create professor rank:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRank) return;
    
    setSubmitting(true);
    try {
      await axiosInstance.put(`/professor-ranks/${editingRank.id}`, {
        name: formData.name,
        priority: parseInt(formData.priority)
      });
      
      // Reset form and refresh list
      setFormData({ name: "", priority: "" });
      setEditingRank(null);
      await fetchProfessorRanks();
    } catch (error) {
      console.error("Failed to update professor rank:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRank = async (id: string) => {
    if (!confirm("Are you sure you want to delete this professor rank?")) {
      return;
    }
    
    try {
      await axiosInstance.delete(`/professor-ranks/${id}`);
      await fetchProfessorRanks();
    } catch (error) {
      console.error("Failed to delete professor rank:", error);
      alert("Cannot delete rank - it might be assigned to professors");
    }
  };

  const handleEditRank = (rank: ProfessorRank) => {
    setEditingRank(rank);
    setFormData({
      name: rank.name,
      priority: rank.priority.toString()
    });
  };

  const handleCancelEdit = () => {
    setEditingRank(null);
    setFormData({ name: "", priority: "" });
  };

  return (
    <MainLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageHeader title="Professors" />

        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
          </div>

          <div className="flex justify-between mb-4">
            <SearchBarWithDebounce
              value={searchQuery}
              setValue={setSearchQuery}
              placeholder="Search by name or registration number"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRankModal(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Professor Rank
              </button>
              <Link
                to="/professors/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Professor
              </Link>
            </div>
          </div>

          <ProfessorsTable
            professors={professors}
            isLoading={loading}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            label="Professor List"
          />
        </div>

        {/* Professor Rank Modal */}
        {showRankModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Professor Ranks Management
                </h3>
                <button
                  onClick={() => setShowRankModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Section */}
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900">
                    {editingRank ? "Edit Professor Rank" : "Add New Professor Rank"}
                  </h4>
                  
                  <form onSubmit={editingRank ? handleUpdateRank : handleCreateRank} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Rank Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Assistant Professor"
                      />
                    </div>

                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                        Priority *
                      </label>
                      <input
                        type="number"
                        id="priority"
                        name="priority"
                        required
                        min="1"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 1 (lower number = higher rank)"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {submitting ? "Saving..." : editingRank ? "Update Rank" : "Create Rank"}
                      </button>
                      {editingRank && (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* List Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Existing Ranks</h4>
                  
                  {loadingRanks ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-500">Loading ranks...</p>
                    </div>
                  ) : professorRanks.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">No professor ranks found</p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Rank Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {professorRanks.map((rank) => (
                            <tr key={rank.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {rank.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {rank.priority}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                  onClick={() => handleEditRank(rank)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteRank(rank.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}