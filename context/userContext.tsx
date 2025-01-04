"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  decodedToken: any | null;
  setDecodedToken: React.Dispatch<React.SetStateAction<any | null>>;
  user: any | null;
  setUser: React.Dispatch<React.SetStateAction<any | null>>;
  isLead: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const loadFromLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [decodedToken, setDecodedToken] = useState<any | null>(
    () => loadFromLocalStorage("decodedToken") || null
  );
  const [user, setUser] = useState<any | null>(
    () => loadFromLocalStorage("user") || null
  );

  const isLead = user?.role === "lead";
  useEffect(() => {
    saveToLocalStorage("decodedToken", decodedToken);
  }, [decodedToken]);

  useEffect(() => {
    saveToLocalStorage("user", user);
  }, [user]);

  return (
    <UserContext.Provider
      value={{ decodedToken, setDecodedToken, user, setUser, isLead }}
    >
      {children}
    </UserContext.Provider>
  );
};
