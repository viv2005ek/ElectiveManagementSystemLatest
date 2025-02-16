import axiosInstance from "../axiosInstance";
import { AxiosResponse } from "axios";


//auth interfaces..
interface Credentials {
  email: string;
  password: string;
}
interface AuthResponse {
    token: string;
}

interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    registrationNumber: string;
}

interface AuthUser {
    id: string;
    email: string;
    role: "STUDENT" | "FACULTY" | "ADMIN";
    student?: { id: string; firstName: string; lastName: string; registrationNumber: string; semester: number; batch: string; branch: { id: string; name: string } };
    faculty?: { id: string; firstName: string; lastName: string; registrationNumber: string; department: { id: string; name: string } };
    admin?: { id: string; firstName: string; lastName: string; registrationNumber: string };
}


//branch interfaces
interface Branch {
    id: string;
    name: string;
    departmentId: string
} 

//bucket
interface CourseBucket {
    name: string;
    departmentId: string 
}
interface BulkAddCourseBucketsRequest {
    courseBuckets: CourseBucket[] 
}

// Course category
interface CourseCategory { 
    name: string;
    allotmentType: "STANDALONE"
}

interface Course {
  id: string;
  name: string;
  categoryId: string;
}

//department interface

interface Department {
    id: string;
    name: string;
    code :string;
}


//student 

interface Student {
    id: string;
    name: string;
    email : string;
    age : number;
}

interface BulkAddStudentsRequest {
    students: {
      firstName: string;
      lastName: string;
      gender: string;
      contactNumber: string;
      registrationNumber: string;
      semester: number;
      batch: number;
      email: string;
      section: string;
      departmentId: string;
      branchId: string;
      password: string;
    }[];
  }

  interface Subject {
    id?: string;
    name: string;
    semester: number;
    batch: number;
    categoryId: string;
    branchIds: string[];
    courseIds?: string[];
    courseBucketIds?: string[];
    semesters?: number[];
    departmentId: string;
    canOptOutsideDepartment?: boolean; isEnrollOpen?: boolean;
    enrollmentDeadline?: string 
  }

const useApi = () => {
  // Authentication APIs
  const login = async (credentials: Credentials): Promise<AxiosResponse<AuthResponse>> => {
    return await axiosInstance.post(`/auth/login`, credentials);
  };

  const register = async (data: RegisterData): Promise<void> => {
    await axiosInstance.post(`/auth/register`, data);
  };

  const logout = async (): Promise<AxiosResponse<void>> => {
    return await axiosInstance.post(`/auth/logout`);
  };

  const getAuthenticatedUser = async (): Promise<AxiosResponse<AuthUser>> => {
    return await axiosInstance.get(`/auth/me`);
  };


  // Branches APIs
  const getAllBranches = async (): Promise<AxiosResponse<Branch[]>> => {
    return await axiosInstance.get(`/branches`);
  };

  const getBranchById = async (id: string): Promise<AxiosResponse<Branch>> => {
    return await axiosInstance.get(`/branches/${id}`);
  };

  const getBranchesByDepartment = async (departmentId: string): Promise<AxiosResponse<Branch[]>> => {
    return await axiosInstance.get(`/branches/department/${departmentId}`);
  };


  // Course Buckets APIs 
  const getAllCourseBuckets = async (): Promise<AxiosResponse<CourseBucket[]>> => {
    return await axiosInstance.get(`/course-buckets`);
  };
  const getCourseBucketById = async (id: string): Promise<AxiosResponse<CourseBucket>> => {
    return await axiosInstance.get(`/course-buckets/${id}`);
  };
  const bulkAddCourseBuckets = async (data: BulkAddCourseBucketsRequest): Promise<AxiosResponse<void>> => {
    return await axiosInstance.post(`/course-buckets/bulk-add`, data);
  };


  // Course Categories APIs
  const createCourseCategory = async (data: CourseCategory): Promise<AxiosResponse<CourseCategory>> => {
    return await axiosInstance.post(`/course-categories`, data);
  };

  const getAllCourseCategories = async (): Promise<AxiosResponse<CourseCategory[]>> => {
    return await axiosInstance.get(`/course-categories`);
  };

  const getCourseCategoryById = async (id: string): Promise<AxiosResponse<CourseCategory>> => {
    return await axiosInstance.get(`/course-categories/${id}`);
  };

  const updateCourseCategory = async (id: string, data: CourseCategory): Promise<AxiosResponse<CourseCategory>> => {
    return await axiosInstance.put(`/course-categories/${id}`, data);
  };

  const deleteCourseCategory = async (id: string): Promise<AxiosResponse<void>> => {
    return await axiosInstance.delete(`/course-categories/${id}`);
  };

  
  // Courses APIs
  const getAllCourses = async (): Promise<AxiosResponse<Course[]>> => {
    return await axiosInstance.get(`/courses`);
  };

  const addCourse = async (data: Course): Promise<AxiosResponse<Course>> => {
    return await axiosInstance.post(`/courses`, data);
  };

  const getCourseById = async (id: string): Promise<AxiosResponse<Course>> => {
    return await axiosInstance.get(`/courses/${id}`);
  };

  const updateCourse = async (id: string, data: Course): Promise<AxiosResponse<Course>> => {
    return await axiosInstance.put(`/courses/${id}`, data);
  };

  const deleteCourse = async (id: string): Promise<AxiosResponse<void>> => {
    return await axiosInstance.delete(`/courses/${id}`);
  };

  const getCoursesByCategory = async (id: string): Promise<AxiosResponse<Course[]>> => {
    return await axiosInstance.get(`/courses/by-category/${id}`);
  };

  const bulkAddCourses = async (data: Course[]): Promise<AxiosResponse<void>> => {
    return await axiosInstance.post(`/courses/bulk-add`, data);
  };



  // Departments APIs
  const getAllDepartments = async (): Promise<AxiosResponse<Department[]>> => {
    return await axiosInstance.get(`/departments`);
  };

  const getDepartmentById = async (id: string): Promise<AxiosResponse<Department>> => {
    return await axiosInstance.get(`/departments/${id}`);
  };

  const bulkAddDepartments = async (data: Department[]): Promise<AxiosResponse<void>> => {
    return await axiosInstance.post(`/departments/bulk-add`, data);
  };




  // Students APIs
  const getAllStudents = async (): Promise<AxiosResponse<Student[]>> => {
    return await axiosInstance.get(`/students`);
  };

  const getStudentById = async (id: string): Promise<AxiosResponse<Student>> => {
    return await axiosInstance.get(`/students/${id}`);
  };

  const bulkAddStudents = async (data: BulkAddStudentsRequest): Promise<AxiosResponse<Student[]>> => {
    return await axiosInstance.post(`/students/bulk-add`, data);
  };

  // Subjects APIs
  const getAllSubjects = async (): Promise<AxiosResponse<Subject[]>> => {
    return await axiosInstance.get(`/subjects`);
  };

  const createSubject = async (data: Subject): Promise<AxiosResponse<Subject>> => {
    return await axiosInstance.post(`/subjects`, data);
  };

  const updateSubject = async (id: string, data: Subject): Promise<AxiosResponse<Subject>> => {
    return await axiosInstance.put(`/subjects/${id}`, data);
  };

  const deleteSubject = async (id: string): Promise<AxiosResponse<void>> => {
    return await axiosInstance.delete(`/subjects/${id}`);
  };

  const openSubjectEnrollment = async (data: { id: string; isEnrollOpen: boolean; enrollmentDeadline: string }): Promise<AxiosResponse<void>> => {
    return await axiosInstance.patch(`/subjects/enrollment`, data);
  };

  return {
    login,
    register,
    logout,
    getAuthenticatedUser,
    getAllCourseBuckets,
    getCourseBucketById,
    bulkAddCourseBuckets,
    createCourseCategory,
    getAllCourseCategories,
    getCourseCategoryById,
    updateCourseCategory,
    deleteCourseCategory,
    getAllBranches,
    getBranchById,
    getBranchesByDepartment,
    getAllCourses,
    addCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCoursesByCategory,
    bulkAddCourses,
    getAllDepartments,
    getDepartmentById,
    bulkAddDepartments,
    getAllStudents,
    getStudentById,
    bulkAddStudents,
    getAllSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    openSubjectEnrollment,
  };
};

export default useApi;