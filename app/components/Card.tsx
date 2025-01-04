"use client";
import React from "react";
import { Task } from "../types/task";

export const Card: React.FC<any> = ({ task }) => {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "NOT_STARTED":
        return "bg-gray-500";
      case "ON_PROGRESS":
        return "bg-yellow-500";
      case "DONE":
        return "bg-green-500";
      case "REJECT":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold text-gray-800">{task?.title}</h2>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
            task?.status
          )}`}
        >
          {task.status.replace("_", " ")}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{task.description}</p>
      <div className="text-sm text-gray-500 mb-2">
        <p className="flex items-center mb-1">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
          Assigned to:{" "}
          <span className="font-medium ml-1">{task.assignedUser.name}</span>
        </p>
        <p className="flex items-center">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
          Created by:{" "}
          <span className="font-medium ml-1">{task.created_by.name}</span>
        </p>
      </div>
      <div className="text-xs text-gray-400 mt-4 pt-2 border-t border-gray-200">
        <p className="flex items-center mb-1">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          Created: {new Date(task.created_at).toLocaleString()}
        </p>
        <p className="flex items-center">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          Updated: {new Date(task.updated_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};
