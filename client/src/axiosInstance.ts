import axios from "axios";

const getBaseURL = () => {
  const isProd = import.meta.env.MODE === "production";
  const isVercel = window.location.hostname.includes('vercel.app');
  
  if (isProd && isVercel) {
    // When on Vercel, use Render backend
    return "https://ems-backend-kygt.onrender.com/api";
  }
  
  // Use environment variable or fallback
  return `${import.meta.env.VITE_BASE || 'http://localhost:8080'}/api`;
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

console.log('API Base URL:', axiosInstance.defaults.baseURL);

export default axiosInstance;
