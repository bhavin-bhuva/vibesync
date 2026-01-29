import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  return (
    <div className="relative w-full">
      <input
        {...props}
        onChange={handleChange}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        className={`
          peer w-full px-4 py-3 bg-white/5 border-2 rounded-lg
          ${error ? "border-red-500" : "border-white/10 focus:border-purple-500"}
          text-gray-900 dark:text-white placeholder-transparent
          focus:outline-none transition-all duration-200
          ${className}
        `}
        placeholder={label}
      />
      <label
        className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${
            isFocused || hasValue || props.value
              ? "-top-2.5 text-xs bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20 px-1"
              : "top-3 text-base"
          }
          ${error ? "text-red-500" : isFocused ? "text-purple-500" : "text-gray-500 dark:text-gray-400"}
        `}
      >
        {label}
      </label>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
