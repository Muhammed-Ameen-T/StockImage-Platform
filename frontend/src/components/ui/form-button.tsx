// components/ui/form-button.tsx
import { ReactNode, ButtonHTMLAttributes } from "react"
import LoadingSpinner from "./loading-spinner"

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  icon?: ReactNode
  variant?: "primary" | "secondary" | "success"
  children: ReactNode
}

export default function FormButton({
  loading = false,
  loadingText = "Loading...",
  icon,
  variant = "primary",
  disabled = false,
  children,
  className = "",
  ...props
}: FormButtonProps) {
  const isDisabled = disabled || loading

  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-green-500/20"
      case "secondary":
        return "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500/20"
      default:
        return "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500/20"
    }
  }

  return (
    <button
      disabled={isDisabled}
      className={`
        w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-4
        ${isDisabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : `${getVariantClasses()} text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]`
        }
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner />
          <span>{loadingText}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {icon}
          <span>{children}</span>
        </div>
      )}
    </button>
  )
}