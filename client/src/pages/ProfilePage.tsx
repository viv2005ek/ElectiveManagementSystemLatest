// ProfilePage.tsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.tsx";
import PageHeader from "../components/PageHeader.tsx";
import axiosInstance from "../axiosInstance.ts";
import { 
  UserCircleIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BuildingLibraryIcon,
  BookOpenIcon,
  UserGroupIcon,
  MapPinIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { RootState } from "../redux/store.ts";
import { UserRole } from "../types/UserTypes.ts";

interface AdminProfile {
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  createdDate: string;
  role: string;
}

interface StudentProfile {
  name: string;
  registrationNumber: string;
  email: string;
  personalInformation: {
    contactNumber: string;
  };
  academicInformation: {
    program: string;
    semester: string;
    batch: string;
    department: string;
    school: string;
  };
  contactInformation: {
    emailAddress: string;
    registrationNumber: string;
  };
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const navigate = useNavigate();

  // Get user role from Redux store
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.role;

  useEffect(() => {
    if (userRole) {
      fetchUserProfile();
    } else {
      setLoading(false);
      setError("User not authenticated");
    }
  }, [userRole]);

  const fetchUserProfile = async () => {
    if (!userRole) {
      setError("User role not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching profile for role:', userRole);
      
      if (userRole === UserRole.ADMIN) {
        console.log('Calling API: /profiles/admin');
        const response = await axiosInstance.get('/profile/admin');
        console.log('API Response:', response);
        setAdminProfile(response.data.data);
      } else if (userRole === UserRole.STUDENT) {
        console.log('Calling API: /profiles/student');
        const response = await axiosInstance.get('/profile/student');
        console.log('API Response:', response);
        setStudentProfile(response.data.data);
      } else {
        setError(`Profile access not available for ${userRole} role`);
      }
      
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      
      // Handle different error types
      if (err.response?.status === 401) {
        setError("Unauthorized: Please log in again");
        // Redirect to login after 2 seconds
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 403) {
        setError("Access forbidden: You don't have permission to view this profile");
      } else if (err.response?.status === 404) {
        setError("Profile not found: The requested profile endpoint does not exist");
      } else {
        setError(err.response?.data?.message || "Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show unauthorized access message for students trying to access admin features
  if (userRole && ![UserRole.ADMIN, UserRole.STUDENT].includes(userRole)) {
    return (
      <MainLayout>
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <PageHeader title="Profile" />
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Access Restricted</h3>
            <p className="text-yellow-600 mb-4">
              Profile access is not available for {userRole} role.
            </p>
            <button
              onClick={() => navigate('/home')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              Go to Home
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <PageHeader title="Profile" />
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <PageHeader title="Profile" />
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <UserCircleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Profile</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={fetchUserProfile}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/home')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!userRole) {
    return (
      <MainLayout>
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <PageHeader title="Profile" />
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <UserCircleIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Authentication Required</h3>
            <p className="text-yellow-600">Please log in to view your profile.</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <PageHeader title="My Profile" />
        
        {/* Admin Profile */}
        {userRole === UserRole.ADMIN && adminProfile && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <ShieldCheckIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {adminProfile.firstName} {adminProfile.lastName}
                  </h1>
                  <p className="text-blue-100">{adminProfile.role}</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Personal Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">First Name</label>
                      <p className="mt-1 text-sm text-gray-900">{adminProfile.firstName}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Last Name</label>
                      <p className="mt-1 text-sm text-gray-900">{adminProfile.lastName}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Registration Number</label>
                      <p className="mt-1 text-sm text-gray-900">{adminProfile.registrationNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Contact & System Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email Address</label>
                      <p className="mt-1 text-sm text-gray-900">{adminProfile.email}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Role</label>
                      <p className="mt-1 text-sm text-gray-900">{adminProfile.role}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Member Since</label>
                      <p className="mt-1 text-sm text-gray-900">{adminProfile.createdDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Profile */}
        {userRole === UserRole.STUDENT && studentProfile && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <AcademicCapIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {studentProfile.name}
                  </h1>
                  <p className="text-green-100">Student</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6 space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Personal Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Contact Number</label>
                      <p className="text-sm text-gray-900">{studentProfile.personalInformation.contactNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpenIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Program</label>
                        <p className="text-sm text-gray-900">{studentProfile.academicInformation.program}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Semester</label>
                        <p className="text-sm text-gray-900">{studentProfile.academicInformation.semester}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <UserGroupIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Batch</label>
                        <p className="text-sm text-gray-900">{studentProfile.academicInformation.batch}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Department</label>
                        <p className="text-sm text-gray-900">{studentProfile.academicInformation.department}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                    <div className="flex items-center space-x-3">
                      <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <label className="block text-sm font-medium text-gray-600">School</label>
                        <p className="text-sm text-gray-900">{studentProfile.academicInformation.school}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Email Address</label>
                        <p className="text-sm text-gray-900">{studentProfile.contactInformation.emailAddress}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Registration Number</label>
                        <p className="text-sm text-gray-900">{studentProfile.contactInformation.registrationNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}