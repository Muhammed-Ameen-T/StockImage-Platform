import { cn } from "@/lib/utils"

// Enhanced Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: boolean
  helperText?: string
}

export function Input({ 
  className, 
  leftIcon, 
  rightIcon, 
  error = false, 
  helperText, 
  ...props 
}: InputProps) {
  return (
    <div className="relative w-full">
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition-all duration-200",
            "placeholder:text-gray-500",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none",
            "hover:border-gray-300",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {helperText && (
        <p className={cn(
          "mt-1.5 text-xs",
          error ? "text-red-600" : "text-gray-600"
        )}>
          {helperText}
        </p>
      )}
    </div>
  )
}