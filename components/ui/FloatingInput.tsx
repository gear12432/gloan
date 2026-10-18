'use client';

import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  readOnlyText?: boolean;
}

export default function FloatingInput({
  label,
  icon: Icon,
  value,
  onChange,
  onFocus,
  onBlur,
  type = 'text',
  error,
  readOnlyText,
  className = '',
  required,
  ...props
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <div className="w-full space-y-1">
      <div className="relative w-full">
        {/* Left Icon if provided - Black color as requested */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none z-10">
            <Icon className="w-5 h-5 text-slate-900" />
          </div>
        )}

        {/* Input Element with Black Text, Bolder & Larger Font */}
        <input
          {...props}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          placeholder=" "
          className={`w-full bg-white border-2 rounded-2xl py-3.5 text-base sm:text-lg font-black text-slate-900 transition-all duration-200 outline-none ${
            Icon ? 'pl-11 pr-4' : 'px-4'
          } ${
            readOnlyText ? 'bg-slate-50 border-slate-200' : ''
          } ${
            error
              ? 'border-red-400 focus:ring-2 focus:ring-red-400/30'
              : isFocused
              ? 'border-[#0d9488] ring-4 ring-[#0d9488]/15 shadow-xs'
              : 'border-slate-200 hover:border-slate-300'
          } ${className}`}
        />

        {/* Smooth Floating Label */}
        <label
          className={`absolute pointer-events-none transition-all duration-200 ease-out z-10 px-1 font-bold rounded ${
            Icon ? 'left-10' : 'left-3.5'
          } ${
            isFloating
              ? '-top-3 text-xs sm:text-xs bg-white text-[#0d9488] font-black tracking-wide shadow-2xs'
              : 'top-1/2 -translate-y-1/2 text-sm sm:text-base text-slate-500 font-bold'
          } ${error ? 'text-red-500' : ''}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>

      {error && <p className="text-xs font-bold text-red-500 pl-1">{error}</p>}
    </div>
  );
}
