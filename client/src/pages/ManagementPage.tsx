import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";
import axiosInstance from "../axiosInstance.ts";
import {
  AcademicCapIcon,
  CalendarIcon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

// Interfaces
interface Semester {
  id: string;
  number: number;
}

interface Batch {
  id: string;
  year: number;
}

interface ProfessorRank {
  id: string;
  name: string;
  priority: number;
}

interface ModalData {
  isOpen: boolean;
  type: 'semester' | 'batch' | 'professorRank' | null;
  mode: 'create' | 'edit';
  data: any;
}

interface ResultModalData {
  isOpen: boolean;
  type: 'success' | 'error' | null;
  title: string;
  message: string;
  details?: any;
}

export default function ManagementPage() {
  const [activeTab, setActiveTab] = useState<'semesters' | 'batches' | 'professorRanks'>('semesters');
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [professorRanks, setProfessorRanks] = useState<ProfessorRank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalData>({
    isOpen: false,
    type: null,
    mode: 'create',
    data: null
  });
  const [formData, setFormData] = useState({
    number: '',
    year: '',
    name: '',
    priority: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: '', id: '', name: '' });
  const [resultModal, setResultModal] = useState<ResultModalData>({
    isOpen: false,
    type: null,
    title: '',
    message: '',
    details: null
  });

  // Fetch data based on active tab
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      switch (activeTab) {
        case 'semesters':
          const semestersResponse = await axiosInstance.get('/semesters');
          console.log('Semesters API response:', semestersResponse.data);
          // Sort semesters in descending order by number
          const sortedSemesters = semestersResponse.data.sort((a: Semester, b: Semester) => b.number - a.number);
          setSemesters(sortedSemesters);
          break;
        case 'batches':
          const batchesResponse = await axiosInstance.get('/batches');
          console.log('Batches API response:', batchesResponse.data);
          // Sort batches in descending order by year
          const sortedBatches = batchesResponse.data.sort((a: Batch, b: Batch) => b.year - a.year);
          setBatches(sortedBatches);
          break;
        case 'professorRanks':
          const ranksResponse = await axiosInstance.get('/professor-ranks');
          console.log('Professor Ranks API response:', ranksResponse.data);
          // Professor ranks are already sorted by priority in ascending order from the API
          setProfessorRanks(ranksResponse.data.data || ranksResponse.data);
          break;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to fetch data';
      setError(errorMessage);
      showResultModal('error', 'Fetch Error', errorMessage, err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const showResultModal = (type: 'success' | 'error', title: string, message: string, details?: any) => {
    setResultModal({
      isOpen: true,
      type,
      title,
      message,
      details
    });
  };

  const closeResultModal = () => {
    setResultModal({
      isOpen: false,
      type: null,
      title: '',
      message: '',
      details: null
    });
  };

  const openCreateModal = (type: 'semester' | 'batch' | 'professorRank') => {
    setModal({
      isOpen: true,
      type,
      mode: 'create',
      data: null
    });
    setFormData({
      number: '',
      year: '',
      name: '',
      priority: ''
    });
  };

  const openEditModal = (type: 'semester' | 'batch' | 'professorRank', data: any) => {
    setModal({
      isOpen: true,
      type,
      mode: 'edit',
      data
    });
    setFormData({
      number: data.number?.toString() || '',
      year: data.year?.toString() || '',
      name: data.name || '',
      priority: data.priority?.toString() || ''
    });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, mode: 'create', data: null });
    setFormData({ number: '', year: '', name: '', priority: '' });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let payload: any = {};
      let url = '';

      switch (modal.type) {
        case 'semester':
          if (!formData.number || parseInt(formData.number) < 1) {
            throw new Error('Semester number must be at least 1');
          }
          payload = { number: parseInt(formData.number) };
          url = modal.mode === 'create' ? '/semesters' : `/semesters/${modal.data.id}`;
          break;
        case 'batch':
          if (!formData.year || parseInt(formData.year) < 2000) {
            throw new Error('Batch year must be at least 2000');
          }
          payload = { year: parseInt(formData.year) };
          url = modal.mode === 'create' ? '/batches' : `/batches/${modal.data.id}`;
          break;
        case 'professorRank':
          if (!formData.name || !formData.priority || parseInt(formData.priority) < 1) {
            throw new Error('Name and priority (minimum 1) are required');
          }
          payload = { 
            name: formData.name,
            priority: parseInt(formData.priority)
          };
          url = modal.mode === 'create' ? '/professor-ranks' : `/professor-ranks/${modal.data.id}`;
          break;
      }

      let response;
      if (modal.mode === 'create') {
        response = await axiosInstance.post(url, payload);
      } else {
        response = await axiosInstance.put(url, payload);
      }

      closeModal();
      showResultModal(
        'success', 
        `${modal.type === 'semester' ? 'Semester' : modal.type === 'batch' ? 'Batch' : 'Professor Rank'} ${modal.mode === 'create' ? 'Created' : 'Updated'}`,
        `${modal.type === 'semester' ? 'Semester' : modal.type === 'batch' ? 'Batch' : 'Professor Rank'} has been ${modal.mode === 'create' ? 'created' : 'updated'} successfully.`,
        response.data
      );
      fetchData(); // Refresh data
    } catch (err: any) {
      console.error('Operation error:', err);
      const errorDetails = err.response?.data;
      let errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || `Failed to ${modal.mode} ${modal.type}`;
      
      // Handle specific error cases
      if (err.response?.status === 400) {
        if (modal.type === 'semester') {
          errorMessage = `Semester ${formData.number} already exists. Please use a different semester number.`;
        } else if (modal.type === 'batch') {
          errorMessage = `Batch ${formData.year} already exists. Please use a different year.`;
        } else if (modal.type === 'professorRank') {
          errorMessage = `Professor rank name and priority must be unique. Please use different values.`;
        }
      } else if (err.response?.status === 409) {
        if (modal.type === 'professorRank') {
          errorMessage = `Professor rank "${formData.name}" already exists. Please use a different name.`;
        }
      }

      showResultModal('error', 'Operation Failed', errorMessage, errorDetails);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = '';
      let typeName = '';
      switch (deleteConfirm.type) {
        case 'semester':
          url = `/semesters/${deleteConfirm.id}`;
          typeName = 'Semester';
          break;
        case 'batch':
          url = `/batches/${deleteConfirm.id}`;
          typeName = 'Batch';
          break;
        case 'professorRank':
          url = `/professor-ranks/${deleteConfirm.id}`;
          typeName = 'Professor Rank';
          break;
      }

      await axiosInstance.delete(url);
      setDeleteConfirm({ isOpen: false, type: '', id: '', name: '' });
      showResultModal('success', 'Delete Successful', `${typeName} "${deleteConfirm.name}" has been deleted successfully.`);
      fetchData(); // Refresh data
    } catch (err: any) {
      console.error('Delete error:', err);
      let errorMessage = err.response?.data?.message || err.response?.data?.error || `Failed to delete ${deleteConfirm.type}`;
      
      // Handle specific error cases
      if (err.response?.status === 400) {
        if (deleteConfirm.type === 'professorRank') {
          errorMessage = `Cannot delete professor rank "${deleteConfirm.name}" because it is assigned to professors.`;
        }
      }

      showResultModal('error', 'Delete Failed', errorMessage, err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirm = (type: 'semester' | 'batch' | 'professorRank', id: string, name: string) => {
    setDeleteConfirm({ isOpen: true, type, id, name });
  };

  return (
    <MainLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PageHeader title="Management Dashboard" />
        
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('semesters')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'semesters'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              Semesters
            </button>
            <button
              onClick={() => setActiveTab('batches')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'batches'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserGroupIcon className="w-5 h-5 mr-2" />
              Batches
            </button>
            <button
              onClick={() => setActiveTab('professorRanks')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'professorRanks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <AcademicCapIcon className="w-5 h-5 mr-2" />
              Professor Ranks
            </button>
          </nav>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
            </div>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header with Add Button */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 capitalize">
              {activeTab === 'semesters' && 'Semesters Management'}
              {activeTab === 'batches' && 'Batches Management'}
              {activeTab === 'professorRanks' && 'Professor Ranks Management'}
            </h3>
            <button
              onClick={() => openCreateModal(activeTab.slice(0, -1) as any)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add New
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading...</p>
            </div>
          )}

          {/* Data Tables */}
          {!loading && (
            <div className="overflow-hidden">
              {/* Semesters Table */}
              {activeTab === 'semesters' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Semester Number
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {semesters.map((semester) => (
                        <tr key={semester.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Semester {semester.number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openEditModal('semester', semester)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <PencilIcon className="w-4 h-4 inline" />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm('semester', semester.id, `Semester ${semester.number}`)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {semesters.length === 0 && (
                        <tr>
                          <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                            No semesters found. Create your first semester.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Batches Table */}
              {activeTab === 'batches' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Batch Year
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {batches.map((batch) => (
                        <tr key={batch.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Batch {batch.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openEditModal('batch', batch)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <PencilIcon className="w-4 h-4 inline" />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm('batch', batch.id, `Batch ${batch.year}`)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {batches.length === 0 && (
                        <tr>
                          <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                            No batches found. Create your first batch.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Professor Ranks Table */}
              {activeTab === 'professorRanks' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openEditModal('professorRank', rank)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <PencilIcon className="w-4 h-4 inline" />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm('professorRank', rank.id, rank.name)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {professorRanks.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                            No professor ranks found. Create your first professor rank.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {modal.isOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {modal.mode === 'create' ? 'Create New' : 'Edit'} {modal.type === 'semester' && 'Semester'}
                    {modal.type === 'batch' && 'Batch'}
                    {modal.type === 'professorRank' && 'Professor Rank'}
                  </h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Semester Form */}
                  {modal.type === 'semester' && (
                    <div>
                      <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                        Semester Number *
                      </label>
                      <input
                        type="number"
                        id="number"
                        name="number"
                        required
                        min="1"
                        value={formData.number}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">Must be unique across all semesters</p>
                    </div>
                  )}

                  {/* Batch Form */}
                  {modal.type === 'batch' && (
                    <div>
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                        Batch Year *
                      </label>
                      <input
                        type="number"
                        id="year"
                        name="year"
                        required
                        min="2000"
                        max="2100"
                        value={formData.year}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">Must be unique across all batches</p>
                    </div>
                  )}

                  {/* Professor Rank Form */}
                  {modal.type === 'professorRank' && (
                    <>
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
                          onChange={handleFormChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">Must be unique across all professor ranks</p>
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
                          onChange={handleFormChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">Lower numbers indicate higher priority. Must be unique.</p>
                      </div>
                    </>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : modal.mode === 'create' ? 'Create' : 'Update'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                  Delete {deleteConfirm.type === 'semester' && 'Semester'}
                  {deleteConfirm.type === 'batch' && 'Batch'}
                  {deleteConfirm.type === 'professorRank' && 'Professor Rank'}
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? 
                    This action cannot be undone.
                  </p>
                  {deleteConfirm.type === 'professorRank' && (
                    <p className="text-sm text-red-600 mt-2">
                      Warning: Cannot delete if rank is assigned to professors.
                    </p>
                  )}
                  {(deleteConfirm.type === 'semester' || deleteConfirm.type === 'batch') && (
                    <p className="text-sm text-red-600 mt-2">
                      Warning: This may affect related records in the system.
                    </p>
                  )}
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => setDeleteConfirm({ isOpen: false, type: '', id: '', name: '' })}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result Modal */}
        {resultModal.isOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                {/* Icon */}
                <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                  resultModal.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {resultModal.type === 'success' ? (
                    <CheckIcon className="h-6 w-6 text-green-600" />
                  ) : (
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  )}
                </div>
                
                {/* Title */}
                <h3 className={`text-lg leading-6 font-medium ${
                  resultModal.type === 'success' ? 'text-green-800' : 'text-red-800'
                } mt-2`}>
                  {resultModal.title}
                </h3>
                
                {/* Message */}
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    {resultModal.message}
                  </p>
                  
                  {/* Show error details if available */}
                  {resultModal.type === 'error' && resultModal.details && (
                    <div className="mt-3 p-2 bg-red-50 rounded text-left">
                      <p className="text-xs text-red-600">
                        {resultModal.details.message || resultModal.details.error || 'An unexpected error occurred'}
                      </p>
                      {modal.type === 'professorRank' && (
                        <p className="text-xs text-red-600 mt-1">
                          Make sure rank name and priority are always unique.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Buttons */}
                <div className="items-center px-4 py-3">
                  <button
                    onClick={closeResultModal}
                    className={`px-4 py-2 text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 ${
                      resultModal.type === 'success' 
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-300' 
                        : 'bg-red-600 hover:bg-red-700 focus:ring-red-300'
                    }`}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}