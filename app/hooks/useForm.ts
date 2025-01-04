import { useState } from "react";

interface FormData {
  title: string;
  description: string;
  assignedUserId: number | string;
  status: string;
}

interface Errors {
  title?: string;
  assignedUserId?: string;
  status?: string;
}

const useForm = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    assignedUserId: "",
    status: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.title) newErrors.title = "Title is required.";
    if (!formData.assignedUserId)
      newErrors.assignedUserId = "Assigned User is required.";
    if (!formData.status) newErrors.status = "Status is required.";

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
    }
  };

  return {
    formData,
    setFormData,
    errors,
    handleChange,
    handleSubmit,
  };
};

export default useForm;
