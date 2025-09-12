"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { logout } from "@/redux/slices/authSlice"
import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard", label: "Dashboard", auth: true },
  { href: "/upload", label: "Upload", auth: true },
  { href: "/reorder", label: "Reorder", auth: true },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const token = useAppSelector((s) => s.auth.token)
  const dispatch = useAppDispatch()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-bold text-xl text-slate-900 hover:text-blue-600 transition-colors duration-200">
          Image Manager
        </Link>
        <div className="flex items-center space-x-1">
          {links.map(
            (l) =>
              token &&
              l.auth && (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "nav-link",
                    pathname === l.href ? "nav-link-active" : "nav-link-inactive"
                  )}
                >
                  {l.label}
                </Link>
              ),
          )}

          <div className="flex items-center space-x-3 ml-6">
            {!token ? (
              <>
                <Link className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200" href="/login">
                  Login
                </Link>
                <Link className="btn-primary" href="/register">
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  dispatch(logout())
                  router.push("/login")
                }}
                className="btn-secondary"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}