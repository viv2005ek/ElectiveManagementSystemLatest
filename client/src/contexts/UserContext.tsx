import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { UserRole } from '../types/UserTypes'; // Make sure this type is defined correctly

interface UserContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  firstName: string | null;
  setFirstName: Dispatch<SetStateAction<string | null>>;
  lastName: string | null;
  setLastName: Dispatch<SetStateAction<string | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  return (
    <UserContext.Provider
      value={{ role, setRole, firstName, setFirstName, lastName, setLastName }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
