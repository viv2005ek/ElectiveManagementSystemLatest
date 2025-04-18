import axios from "axios";

const isProd = import.meta.env.MODE === "production";

const axiosInstance = axios.create({
  baseURL: isProd ? undefined : `${import.meta.env.VITE_BASE}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
