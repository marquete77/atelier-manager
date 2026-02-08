import React from 'react';

interface InputMeasureProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const InputMeasure: React.FC<InputMeasureProps> = ({ label, value, onChange, placeholder = "0.0" }) => {
  return (
    <div className="flex flex-col group">
      <label className="text-sm font-medium text-charcoal-light mb-2 group-focus-within:text-terracotta transition-colors duration-300">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-linen border border-gray-200 text-charcoal rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all duration-300 font-sans text-lg"
          placeholder={placeholder}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-light/50 text-sm font-medium pointer-events-none">
          cm
        </span>
      </div>
    </div>
  );
};