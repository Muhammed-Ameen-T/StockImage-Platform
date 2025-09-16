// components/ui/form-input.tsx
import { ReactNode, InputHTMLAttributes } from "react"
import { WarningIcon, EyeOffIcon, EyeIcon } from "./form-icons"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: ReactNode
  error?: string
  showPasswordToggle?: boolean
  showPassword?: boolean
  onTogglePassword?: () => void
}

export default function FormInput({
  label,
  icon,
  error,
  type = "text",
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  disabled = false,
  className = "",
  ...props
}: FormInputProps) {
  const hasError = Boolean(error)
  const inputType = type === "password" && showPassword ? "text" : type

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={inputType}
          className={`
            block w-full pl-10 ${showPasswordToggle ? "pr-10" : "pr-3"} py-3 border rounded-xl text-sm
            transition-all duration-200 ease-in-out
            placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            hover:border-gray-300
            ${hasError 
              ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-200 bg-white hover:bg-gray-50/50 focus:bg-white'
            }
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            ${className}
          `}
          disabled={disabled}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors duration-200"
            onClick={onTogglePassword}
            disabled={disabled}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {hasError && (
        <div className="flex items-center gap-1.5 mt-2">
          <WarningIcon className="flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}