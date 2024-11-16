import  { createContext, useState, useContext, ReactNode } from 'react';
import { UserRole } from '../types/UserTypes'; // Make sure this type is defined correctly

// Define the type for the context value
interface UserContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
}

// Create the context with the type
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole | null>(null);

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
