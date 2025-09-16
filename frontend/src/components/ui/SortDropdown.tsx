import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface SortOption {
  label: string
  value: string
  icon?: React.ReactNode
}

interface SortDropdownProps {
  onSort: (sortBy: string, sortOrder: "asc" | "desc") => void
  initialSortBy?: string
  initialSortOrder?: "asc" | "desc"
}

export function SortDropdown({
  onSort,
  initialSortBy = "order",
  initialSortOrder = "desc",
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const sortOptions: SortOption[] = [
    { 
      label: "Title", 
      value: "title",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16l4-4m0 0l4 4m-4-4V4" />
      </svg>
    },
    { 
      label: "Order", 
      value: "order",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    },
    { 
      label: "File Size", 
      value: "fileSize",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    },
  ]

  const handleSort = (value: string) => {
    const newSortBy = value
    setSortBy(newSortBy)
    onSort(newSortBy, sortOrder)
    setIsOpen(false)
  }

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc"
    setSortOrder(newSortOrder)
    onSort(sortBy, newSortOrder)
  }

  const currentOption = sortOptions.find(opt => opt.value === sortBy)

  // Chevron icon
  const ChevronIcon = () => (
    <svg 
      className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )

  // Sort order icon
  const SortOrderIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d={sortOrder === "asc" ? "M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" : "M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"} 
      />
    </svg>
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="md"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "min-w-[160px] justify-between shadow-sm transition-all duration-200",
          isOpen && "ring-2 ring-blue-500/20 border-blue-500"
        )}
        rightIcon={<ChevronIcon />}
      >
        <div className="flex items-center gap-2">
          {currentOption?.icon}
          <span className="font-medium">{currentOption?.label}</span>
        </div>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={cn(
          "absolute z-50 mt-2 w-64 rounded-xl bg-white border border-gray-200 shadow-lg",
          "animate-in slide-in-from-top-2 duration-200"
        )}>
          <div className="p-2">
            {/* Sort Options */}
            <div className="space-y-1">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSort(option.value)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors duration-150",
                    "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                    sortBy === option.value && "bg-blue-50 text-blue-700 font-medium"
                  )}
                >
                  <span className={cn(
                    "text-gray-400",
                    sortBy === option.value && "text-blue-600"
                  )}>
                    {option.icon}
                  </span>
                  <span className="flex-1 text-left">{option.label}</span>
                  {sortBy === option.value && (
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="my-3 border-t border-gray-100" />

            {/* Sort Order Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 hover:bg-gray-50"
              onClick={toggleSortOrder}
              leftIcon={<SortOrderIcon />}
            >
              <span className="flex-1 text-left">
                Sort {sortOrder === "asc" ? "Ascending" : "Descending"}
              </span>
              <span className="text-xs text-gray-500 font-normal">
                {sortOrder === "asc" ? "A → Z" : "Z → A"}
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
