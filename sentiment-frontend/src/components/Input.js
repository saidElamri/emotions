import { useState } from "react";

export default function Input({ label, type = "text", value, onChange, placeholder, required, error, icon }) {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.length > 0;

    return (
        <div className="relative">
            {icon && (
                <div className="absolute left-4 top-9 -translate-y-1/2 text-gray-400 z-10">
                    {icon}
                </div>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required={required}
                className={`w-full ${icon ? 'pl-12' : 'px-4'} pr-4 py-3 pt-6 border rounded-lg transition-all duration-200 outline-none ${error
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent'
                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    }`}
                placeholder={isFocused || hasValue ? placeholder : ""}
            />
            <label
                className={`absolute ${icon ? 'left-12' : 'left-4'} transition-all duration-200 pointer-events-none ${isFocused || hasValue
                    ? 'top-1.5 text-xs text-blue-600 font-medium'
                    : 'top-6 text-gray-500'
                    }`}
            >
                {label}
            </label>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
