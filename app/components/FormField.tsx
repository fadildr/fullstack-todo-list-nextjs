type FormFieldProps = {
  type: "text" | "select";
  name: string;
  value: string | number | undefined;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
};

export const FormField: React.FC<FormFieldProps> = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  options,
}) => {
  if (type === "select") {
    return (
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{placeholder}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value as string}
      onChange={onChange}
      className="flex-grow min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};
