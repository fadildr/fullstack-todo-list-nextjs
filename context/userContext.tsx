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
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const loadFromLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  return null;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [decodedToken, setDecodedToken] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    setDecodedToken(loadFromLocalStorage("decodedToken"));
    setUser(loadFromLocalStorage("user"));
  }, []);

  useEffect(() => {
    saveToLocalStorage("decodedToken", decodedToken);
  }, [decodedToken]);

  useEffect(() => {
    saveToLocalStorage("user", user);
  }, [user]);

  const isLead = user?.role === "lead";

  return (
    <UserContext.Provider
      value={{ decodedToken, setDecodedToken, user, setUser, isLead }}
    >
      {children}
    </UserContext.Provider>
  );
};
