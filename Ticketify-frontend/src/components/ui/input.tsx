// src/components/ui/input.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="relative space-y-1 ">
        <input
          type={inputType}
          id={id}
          ref={ref}
          className={cn(
          "w-full", 
          "rounded-[4px] border-[0.5px] border-gray-400 bg-white px-3 py-2",
          "transition-colors placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-red-500 focus-visible:ring-red-500" : "border-input focus-visible:ring-ring",
          className
        )}

        {...props}
      />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <Eye className="w-5 h-5 mb-3 xl:mr-104 lg:mr-104" />
            ) : (
              <EyeOff className="w-5 h-5 mb-3 xl:mr-104 lg:mr-104 " />
            )}
          </button>
        )}
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
