"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUserContext } from "@/context/userContext";
import { ChevronDown } from "./icons/ChevronDown";
import { ChevronRight } from "./icons/ChevronRight";
import { StatusOptions } from "../constant/task";
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  users: any[];
};

type FieldConfig = {
  name: string;
  type?: "text" | "textarea" | "select";
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  disabled?: boolean;
  hidden?: boolean;
};

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  assignedUserId: Yup.number()
    .required("Assigned User is required")
    .positive()
    .integer(),
  status: Yup.string().required("Status is required"),
});

const initialValues = {
  title: "",
  description: "",
  assignedUserId: "",
  status: "NOT_STARTED",
};

const renderField = ({
  name,
  type = "text",
  placeholder,
  options,
  disabled,
  hidden,
}: FieldConfig) => {
  if (hidden) {
    return null;
  }
  if (type === "select") {
    return (
      <Field
        as="select"
        name={name}
        className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
        disabled={disabled}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
    );
  }

  const Component = type === "textarea" ? "textarea" : "input";
  return (
    <Field
      as={Component}
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
      disabled={disabled}
    />
  );
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  users,
}) => {
  const [isActivityLogsOpen, setIsActivityLogsOpen] = useState(false);
  const formInitialValues = { ...initialValues, ...initialData };
  const { isLead } = useUserContext();

  const handleSubmit = (values: any) => {
    onSubmit(values);
    onClose();
  };

  if (!isOpen) return null;

  const activityLogs = initialData?.activityLogs || [];
  const fieldConfigs: FieldConfig[] = [
    {
      name: "title",
      placeholder: "Title",
      disabled: !isLead,
    },
    {
      name: "description",
      type: "textarea",
      placeholder: "Description (optional)",
    },
    {
      name: "assignedUserId",
      type: "select",
      placeholder: "Select a user",
      options: users.map((user) => ({
        value: Number(user.id),
        label: user.name,
      })),
      disabled: !isLead,
    },
    {
      name: "status",
      type: "select",
      placeholder: "Select a status",
      options: StatusOptions,
      hidden: !!!initialData,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[32rem] p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">
          {initialData ? "Update Task" : "Create Task"}
        </h2>
        <Formik
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {fieldConfigs.map((config) => (
                <div key={config.name}>
                  {renderField(config)}
                  <ErrorMessage
                    name={config.name}
                    component="p"
                    className="text-xs text-red-500"
                  />
                </div>
              ))}
              {!!activityLogs.length && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setIsActivityLogsOpen(!isActivityLogsOpen)}
                    className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="font-semibold">Activity Logs</span>
                    {isActivityLogsOpen ? (
                      <ChevronRight size={20} color={"black"} />
                    ) : (
                      <ChevronDown size={20} color={"black"} />
                    )}
                  </button>
                  {isActivityLogsOpen && (
                    <div className="mt-2 space-y-2">
                      {activityLogs.map((log: any, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-3 rounded-lg text-sm"
                        >
                          <p className="font-medium">
                            {log.user.name} updated {log.field} from{" "}
                            <span className="font-bold">{log.beforeValue}</span>{" "}
                            to{" "}
                            <span className="font-bold">{log.afterValue}</span>
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(log.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 mr-2 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  {initialData ? "Update" : "Create"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
