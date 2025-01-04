"use client";

import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { StatusOptions } from "../constant/task";
import { useUserContext } from "@/context/userContext";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  users: any[];
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

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  users,
}) => {
  const formInitialValues = { ...initialValues, ...initialData };
  const { isLead } = useUserContext();
  const handleSubmit = (values: any) => {
    onSubmit(values);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
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
              {/* Title */}
              <Field
                name="title"
                type="text"
                className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="Title"
                disabled={!isLead}
              />
              <ErrorMessage
                name="title"
                component="p"
                className="text-xs text-red-500"
              />

              {/* Description */}
              <Field
                name="description"
                as="textarea"
                rows={4}
                className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="Description (optional)"
              />
              <ErrorMessage
                name="description"
                component="p"
                className="text-xs text-red-500"
              />

              {/* Assign User */}
              <Field
                as="select"
                name="assignedUserId"
                className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                disabled={!isLead}
              >
                <option value="" disabled>
                  Select a user
                </option>
                {users.map((user) => (
                  <option key={user.id} value={Number(user.id)}>
                    {user.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="assignedUserId"
                component="p"
                className="text-xs text-red-500"
              />

              {/* Status */}
              {initialData && (
                <>
                  <Field
                    as="select"
                    name="status"
                    className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  >
                    {StatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="p"
                    className="text-xs text-red-500"
                  />
                </>
              )}

              {/* Buttons */}
              <div className="flex justify-end">
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
