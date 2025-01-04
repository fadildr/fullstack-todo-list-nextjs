import React from "react";
import { useUserContext } from "@/context/userContext";
import Cookies from "js-cookie";
export const Header: React.FC = () => {
  const { user } = useUserContext();

  const handleLogout = async () => {
    try {
      Cookies.remove("token");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Welcome, {user?.name || "User"}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
