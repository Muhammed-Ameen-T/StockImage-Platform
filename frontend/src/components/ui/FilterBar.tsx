import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

interface FilterBarProps {
  onFilter: (search: string) => void
  initialSearch?: string
}

export function FilterBar({ onFilter, initialSearch = "" }: FilterBarProps) {
  const [search, setSearch] = useState(initialSearch)

  useEffect(() => {
    setSearch(initialSearch)
  }, [initialSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter(search.trim())
  }

  const handleClear = () => {
    setSearch("")
    onFilter("")
  }

  // Search icon SVG
  const SearchIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )

  // Clear icon SVG
  const ClearIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )

  return (
    <div className="bg-white rounded-xl  border-gray-200 p-0 shadow-sm">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search images by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<SearchIcon />}
            className="shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            type="submit" 
            variant="primary"
            size="md"
            className="shadow-sm"
          >
            Search
          </Button>
          
          {search && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleClear}
              leftIcon={<ClearIcon />}
              className="shadow-sm hover:bg-gray-50"
            >
              Clear
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}