import { useState } from "react";
import axiosInstance from '../axiosInstance.ts';
import { useUser } from '../contexts/UserContext.tsx';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {setRole } = useUser()

  const login = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/auth/login", {
        email: email,
        password: password,
      });

      setRole(response.data.role)

      console.log(response.data.role);
      navigate('/home')

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
