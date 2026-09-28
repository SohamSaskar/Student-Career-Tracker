'use client';

import React, { useState } from 'react';
import { Input, InputProps } from './Input';
import { Eye, EyeOff } from 'lucide-react';

export type PasswordInputProps = Omit<InputProps, 'type' | 'rightIcon'>;

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Input
        {...props}
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="text-dt-muted hover:text-dt-primary focus:outline-none focus:text-dt-primary p-1 rounded"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
