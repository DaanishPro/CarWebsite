"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Car,
  Menu,
  X,
  Search,
  User,
  Phone,
  Mail,
  Shield,
  Star,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Award,
  Globe
} from "lucide-react"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import ProfileDropdown from "@/components/ProfileDropdown"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user, loading } = useAuth()

  // Handle scroll effect with proper SSR handling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Add event listener only on client side
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)

      // Set initial state
      handleScroll()

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const navLinks = [
    { name: "Home", href: "/home", icon: <Car className="h-4 w-4" /> },
    { name: "Showroom", href: "/features", icon: <Sparkles className="h-4 w-4" /> },
    { name: "About", href: "/about", icon: <Award className="h-4 w-4" /> },
    { name: "Contact", href: "/contact", icon: <Phone className="h-4 w-4" /> },
  ]

  // Do not render Navbar on auth pages
  if (pathname.startsWith("/auth")) {
    return null
  }

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${isScrolled
        ? "bg-white/98 backdrop-blur-xl shadow-2xl border-b border-gray-100"
        : "bg-gradient-to-r from-gray-900/98 via-gray-800/98 to-black/98 backdrop-blur-xl"
      }`}>
      {/* Premium Top Bar */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-2.5">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="font-semibold">Premium Auto Collection</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              <span>24/7 Expert Support</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-yellow-400" />
              <span>Certified Vehicles</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span>5-Star Rated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/home"
            className="flex items-center gap-3 group transition-all duration-300"
          >
            <div className="relative">
              <div className="relative">
                <Car className="h-12 w-12 text-red-600 group-hover:text-red-500 transition-colors duration-300" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
                YeloCar
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">
                Premium Automotive Excellence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`group flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${pathname === link.href
                    ? "text-red-600 bg-red-50 border border-red-200 font-semibold shadow-lg"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50/50"
                  }`}
              >
                {link.icon}
                <span className="font-semibold">{link.name}</span>
                <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300 group-hover:w-full ${pathname === link.href ? "w-full" : ""
                  }`}></div>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:text-red-600 hover:bg-red-50/50 border border-gray-200 hover:border-red-200 transition-all duration-300 font-medium"
            >
              <Search className="h-4 w-4 mr-2" />
              Find The Car
            </Button>

            {/* Auth Buttons */}
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
                <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              </div>
            ) : user ? (
              <ProfileDropdown />
            ) : (
              <>

                <Link href="/auth/signin">
                  <Button className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
                    <User className="h-4 w-4 mr-2" />
                    Sign in
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:text-red-600 hover:bg-red-50/50 border border-gray-200 hover:border-red-200 transition-all duration-300"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[350px] bg-white/98 backdrop-blur-xl border-l border-gray-100">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                  <Link
                    href="/home"
                    className="flex items-center gap-3 text-xl font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    <Car className="h-10 w-10 text-red-600" />
                    <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                      YeloCar
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50/50"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col gap-2 py-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${pathname === link.href
                          ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 font-semibold border-l-4 border-red-500 shadow-lg"
                          : "text-gray-700 hover:bg-gradient-to-r hover:from-red-50/50 hover:to-red-100/50 hover:text-red-600"
                        }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.icon}
                      <span className="font-semibold">{link.name}</span>
                    </Link>
                  ))}
                </nav>

                {/* Mobile Contact Info */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <Phone className="h-4 w-4 text-red-500" />
                      <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <Mail className="h-4 w-4 text-red-500" />
                      <span>info@yelocar.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <Globe className="h-4 w-4 text-red-500" />
                      <span>www.yelocar.com</span>
                    </div>
                  </div>

                  {/* Mobile Auth Section */}
                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse" />
                      <div className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse" />
                    </div>
                  ) : user ? (
                    <div className="px-4">
                      <ProfileDropdown isMobile={true} />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full text-gray-700 hover:text-red-600 hover:border-red-300 hover:bg-red-50/50 border-gray-300 transition-all duration-300 font-medium"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                          <Shield className="h-4 w-4 mr-2" />
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
