import axios from 'axios'

const getJwtFromCookies = (): string | null => {
  const name = 'jwt';
  const cookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1] : null;
};

const axiosInstance = axios.create({
  baseURL: `http://${import.meta.env.VITE_BASE}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getJwtFromCookies();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
