import React from "react";
import { User } from "../types/user";
import { StatusOptions } from "../constant/task";

type FiltersProps = {
  searchTerm: string;
  filterStatus: string;
  assignedUserId: number | undefined;
  sortBy: string;
  sortOrder: "asc" | "desc";
  users: User[];
  onFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
};

export const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  filterStatus,
  assignedUserId,
  users,
  onFilterChange,
}) => (
  <div className="mb-4 space-y-4">
    <div className="flex space-x-4">
      <input
        type="text"
        name="search"
        placeholder="Search items..."
        value={searchTerm}
        onChange={onFilterChange}
        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        name="status"
        value={filterStatus}
        onChange={onFilterChange}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Status</option>
        {StatusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <select
        name="assignedUserId"
        value={assignedUserId || ""}
        onChange={onFilterChange}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Users</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);
