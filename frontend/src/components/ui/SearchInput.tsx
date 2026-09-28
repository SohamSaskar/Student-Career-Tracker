'use client';

import React, { useState } from 'react';
import { Input, InputProps } from './Input';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, placeholder = 'Search skills, roles, projects...', ...props }, ref) => {
    const [internalValue, setInternalValue] = useState('');
    const currentValue = value !== undefined ? String(value) : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setInternalValue('');
      onClear?.();
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        leftIcon={<Search className="w-4 h-4" />}
        rightIcon={
          currentValue ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="text-dt-muted hover:text-dt-primary focus:outline-none p-1 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : undefined
        }
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
