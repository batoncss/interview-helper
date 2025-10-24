import type { LucideIcon } from "lucide-react";

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon;
  required?: boolean;
}

export function InputField({
  id,
  name,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  required = true,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        )}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>
    </div>
  );
}
