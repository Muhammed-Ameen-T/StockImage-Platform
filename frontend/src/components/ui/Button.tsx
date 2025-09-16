import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  loading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  rounded?: "none" | "sm" | "md" | "lg" | "full"
  shadow?: "none" | "sm" | "md" | "lg"
  gradient?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      rounded = "md",
      shadow = "sm",
      gradient = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = [
      "inline-flex items-center justify-center gap-2",
      "font-medium transition-all duration-200 ease-in-out",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "active:scale-95 transform",
      "disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
      "relative overflow-hidden"
    ].join(" ")

    const variants = {
      primary: gradient 
        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white focus:ring-blue-500 border border-transparent"
        : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 border border-transparent",
      
      secondary: gradient
        ? "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 focus:ring-gray-500 border border-gray-300"
        : "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 border border-gray-300",
      
      destructive: gradient
        ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white focus:ring-red-500 border border-transparent"
        : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-transparent",
      
      outline: "border-2 border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-gray-500 hover:border-gray-400",
      
      ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500 border border-transparent",
      
      link: "bg-transparent hover:bg-transparent text-blue-600 hover:text-blue-800 focus:ring-blue-500 border border-transparent underline-offset-4 hover:underline p-0"
    }

    const sizes = {
      xs: "px-2 py-1 text-xs min-h-[24px]",
      sm: "px-3 py-1.5 text-sm min-h-[32px]",
      md: "px-4 py-2 text-sm min-h-[40px]",
      lg: "px-6 py-2.5 text-base min-h-[48px]",
      xl: "px-8 py-3 text-lg min-h-[56px]"
    }

    const roundedStyles = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full"
    }

    const shadowStyles = {
      none: "",
      sm: "shadow-sm hover:shadow",
      md: "shadow hover:shadow-md",
      lg: "shadow-md hover:shadow-lg"
    }

    const widthStyle = fullWidth ? "w-full" : ""

    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          roundedStyles[rounded],
          shadowStyles[shadow],
          widthStyle,
          variant === "link" ? "" : "select-none", // Links should be selectable
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent opacity-70" />
        )}
        
        {/* Left icon */}
        {!loading && leftIcon && (
          <span className="flex-shrink-0">
            {leftIcon}
          </span>
        )}
        
        {/* Button text */}
        <span className={cn(
          "flex-1 truncate",
          (loading || leftIcon || rightIcon) && "mx-1"
        )}>
          {loading && loadingText ? loadingText : children}
        </span>
        
        {/* Right icon */}
        {!loading && rightIcon && (
          <span className="flex-shrink-0">
            {rightIcon}
          </span>
        )}

        {/* Ripple effect overlay */}
        <span className="absolute inset-0 overflow-hidden rounded-[inherit]">
          <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-active:scale-x-100 transition-transform origin-left duration-200" />
        </span>
      </button>
    )
  }
)

Button.displayName = "Button"