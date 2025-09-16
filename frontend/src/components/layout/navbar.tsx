"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { logout } from "@/redux/slices/authSlice"
import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard", label: "Dashboard", auth: true },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const token = useAppSelector((s) => s.auth.accessToken)
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserDropdownOpen(false)
      }
    }

    if (isUserDropdownOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isUserDropdownOpen])

  const handleLogout = () => {
    dispatch(logout())
    router.push("/login")
    setIsUserDropdownOpen(false)
  }

  const handleResetPassword = () => {
    router.push("/reset-password")
    setIsUserDropdownOpen(false)
  }

  // Get user initials for avatar
  const getUserInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Icons
  const UploadIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  )

  const ChevronIcon = () => (
    <svg 
      className={cn("w-4 h-4 transition-transform duration-200", isUserDropdownOpen && "rotate-180")} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )


  const KeyIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  )

  const LogoutIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )

  const DashboardIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )


  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-1.5">
        {/* Logo */}
        <Link 
          href="/" 
          className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
        >
          Image Manager
        </Link>

        {/* Navigation Links & Actions */}
        <div className="flex items-center gap-6">
          {/* Navigation Links */}
          {token && (
            <nav className="hidden sm:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    pathname === link.href
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <DashboardIcon />
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Main Upload Button - Prominent Design */}
          {token && (
            <Link href="/upload">
              <button className={cn(
                "relative overflow-hidden",
                "flex items-center gap-3 px-5 py-2.5",
                "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
                "text-white font-semibold text-sm",
                "rounded-xl shadow-lg hover:shadow-xl",
                "transform hover:scale-105 active:scale-95",
                "transition-all duration-200 ease-out",
                "border border-blue-500/20",
                "focus:outline-none focus:ring-4 focus:ring-blue-500/30"
              )}>
                <UploadIcon />
                <span>Upload Images</span>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </Link>
          )}

          {/* User Authentication */}
          {!token ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                Login
              </Link>
              <Link 
                href="/register"
                className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            /* User Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200",
                  "hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                  "border border-transparent hover:border-gray-200",
                  isUserDropdownOpen && "bg-gray-100 border-gray-200 shadow-sm"
                )}
              >
                {/* User Avatar */}
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {getUserInitials(user?.name)}
                </div>
                
                {/* User Info */}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">
                    {user?.email}
                  </p>
                </div>

                <ChevronIcon />
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className={cn(
                  "absolute right-0 mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg",
                  "animate-in slide-in-from-top-2 duration-200 z-50"
                )}>
                  {/* User Info Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {getUserInitials(user?.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {user?.name || "User"}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <p className="text-sm text-gray-600 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    {/* Dashboard Link (Mobile) */}
                    <div className="sm:hidden">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className={cn(
                          "flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg transition-colors duration-150",
                          "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                          pathname === "/dashboard" && "bg-blue-50 text-blue-700"
                        )}
                      >
                        <DashboardIcon />
                        <span>Dashboard</span>
                      </Link>
                    </div>

                    {/* Reset Password */}
                    <button
                      onClick={handleResetPassword}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg transition-colors duration-150 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      <KeyIcon />
                      <span>Reset Password</span>
                    </button>

                    <div className="my-2 border-t border-gray-100" />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg transition-colors duration-150 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 focus:outline-none text-gray-700"
                    >
                      <LogoutIcon />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}