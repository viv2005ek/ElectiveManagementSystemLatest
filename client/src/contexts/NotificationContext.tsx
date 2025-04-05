import React, { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";

interface NotificationContextType {
  notify: (
    type: "success" | "error" | "info" | "default" | "promise",
    message: string,
    promise?: Promise<any>,
    errorMessage?: string, // Optional error message
  ) => void;
  isLoading: boolean;
}

const defaultContextValue: NotificationContextType = {
  notify: () => {}, // Default no-op function
  isLoading: false,
};

const NotificationContext =
  createContext<NotificationContextType>(defaultContextValue);

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const notify = (
    type: "success" | "error" | "info" | "default" | "promise",
    message: string,
    promise?: Promise<void>,
    errorMessage?: string, // Optional error message
  ) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "info":
        toast.info(message);
        break;
      case "promise":
        if (promise) {
          // Handling toast.promise for pending, success, and error states
          toast.promise(promise, {
            pending: "Loading...",
            success: "Operation successful!",
            error: errorMessage || "An error occurred. Please try again.", // Use custom error message if provided
          });
        } else {
          toast.error("Promise was not provided.");
        }
        break;
      default:
        toast(message);
        break;
    }
  };

  return (
    <NotificationContext.Provider value={{ notify, isLoading }}>
      {children}
    </NotificationContext.Provider>
  );
};
