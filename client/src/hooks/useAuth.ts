import { useState } from 'react';
import axiosInstance from '../axiosInstance.ts';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store.ts';
import { fetchUser } from '../redux/slices/authSlice.ts';

interface UseAuthReturn {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.post("/auth/login", {
        email: email,
        password: password,
      });

      await dispatch(fetchUser());

      navigate("/home");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    isLoading,
    error,
    login,
  };
}
