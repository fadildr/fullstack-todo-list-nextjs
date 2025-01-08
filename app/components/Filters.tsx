import React from "react";
import { User } from "../types/user";
import { StatusOptions } from "../constant/task";
import { FormField } from "./FormField";
type FiltersProps = {
  searchTerm: string;
  filterStatus: string;
  assignedUserId: number | undefined;
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
}) => {
  const formFields = [
    {
      name: "search",
      type: "text",
      value: searchTerm,
      onChange: onFilterChange,
      placeholder: "Search items...",
    },
    {
      name: "status",
      type: "select",
      value: filterStatus,
      onChange: onFilterChange,
      placeholder: "All Status",
      options: StatusOptions,
    },
    {
      name: "assignedUserId",
      type: "select",
      value: assignedUserId,
      onChange: onFilterChange,
      placeholder: "All Users",
      options: users.map((user) => ({
        value: user.id,
        label: user.name,
      })),
    },
  ];
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-4">
        {formFields.map((field) => (
          <FormField
            key={field.name}
            type={field.type as any}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            placeholder={field.placeholder}
            options={field.options}
          />
        ))}
      </div>
    </div>
  );
};
