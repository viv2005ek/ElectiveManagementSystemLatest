import axios from "axios";

const getBaseURL = () => {
  // Check if we're on localhost
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' || 
                      window.location.hostname === '[::1]';
  
  if (isLocalhost) {
    // Use localhost backend when developing locally
    return `${import.meta.env.VITE_BASE || 'http://localhost:8080'}/api`;
  }
  
  // For all other environments (production, staging, etc.), use the actual API
  return "https://ems-backend-kygt.onrender.com/api";
};
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// // console.log('API Base URL:', axiosInstance.defaults.baseURL);

export default axiosInstance;
