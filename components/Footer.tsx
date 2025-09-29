"use client"

import Link from "next/link"
import { Car, Instagram, Facebook, Twitter, Linkedin, Mail, Phone, MapPin, ArrowRight, Star, Shield, Clock, Users } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()

  // Do not render Footer on auth pages
  if (pathname.startsWith("/auth")) {
    return null
  }

  return (
    <footer className="w-full bg-gradient-to-br from-theme-accent-900 via-theme-accent-800 to-theme-accent-900 text-theme-accent-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23eab308' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="container py-16 md:py-20 px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link 
                href="/home" 
                className="flex items-center gap-3 text-2xl font-display font-bold text-[#C62020] hover:text-[#C62020] transition-colors duration-300 group"
              >
                <div className="relative">
                  <Car className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#C62020] rounded-full animate-pulse"></div>
                </div>
                <span className=" text-[#C62020]">
                  YeloCar
                </span>
              </Link>
              <p className="text-theme-accent-400 mt-6 text-sm leading-relaxed max-w-xs">
                Sell your cars with high potential. Your trusted partner in automotive sales, 
                connecting buyers and sellers with confidence and transparency.
              </p>
              
              {/* Trust Indicators */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-theme-accent-400">
                  <Shield className="h-4 w-4 text-theme-success-400" />
                  <span>100% Secure Transactions</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-theme-accent-400">
                  <Clock className="h-4 w-4 text-theme-secondary-400" />
                  <span>24/7 Customer Support</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-theme-accent-400">
                  <Users className="h-4 w-4 text-theme-primary-400" />
                  <span>50,000+ Happy Customers</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-display font-semibold text-white mb-6 relative">
                Quick Links
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-theme-primary-500 to-theme-secondary-500"></div>
              </h3>
              <nav className="space-y-3">
                {[
                  { name: "Home", href: "/home" },
                  { name: "Features", href: "/features" },
                  { name: "About Us", href: "/about" },
                  { name: "Contact Us", href: "/contact" },
                ].map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-2 text-theme-accent-400 hover:text-theme-secondary-400 transition-all duration-300 group text-sm"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Services */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-display font-semibold text-white mb-6 relative">
                Our Services
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-theme-primary-500 to-theme-secondary-500"></div>
              </h3>
              <nav className="space-y-3">
                {[
                  "Car Selling",
                  "Car Buying",
                  "Vehicle Inspection",
                  "Financing Options",
                  "Insurance Services",
                  "Trade-in Services",
                ].map((service) => (
                  <Link
                    key={service}
                    href="#"
                    className="flex items-center gap-2 text-theme-accent-400 hover:text-theme-secondary-400 transition-all duration-300 group text-sm"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <span>{service}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact & Social */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-display font-semibold text-white mb-6 relative">
                Connect With Us
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-theme-primary-500 to-theme-secondary-500"></div>
              </h3>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-theme-accent-400">
                  <Mail className="h-4 w-4 text-theme-primary-400" />
                  <span>info@yelocar.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-theme-accent-400">
                  <Phone className="h-4 w-4 text-theme-primary-400" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-theme-accent-400">
                  <MapPin className="h-4 w-4 text-theme-primary-400" />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>
              
              <p className="text-theme-accent-400 text-sm mb-6">
                Follow us on social media for the latest updates, car listings, and exclusive offers.
              </p>
              
              {/* Social Links */}
              <nav className="flex gap-4">
                {[
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                ].map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-theme-accent-800 hover:bg-theme-secondary-500 text-theme-accent-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-theme-accent-800 bg-theme-accent-950/50 backdrop-blur-sm">
          <div className="container py-8 px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-display font-semibold text-white mb-2">
                  Stay Updated
                </h3>
                <p className="text-theme-accent-400 text-sm">
                  Get the latest car listings and exclusive offers delivered to your inbox.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 bg-theme-accent-800/50 border border-theme-accent-700 rounded-xl text-white placeholder-theme-accent-500 focus:outline-none focus:ring-2 focus:ring-theme-primary-500 focus:border-transparent transition-all duration-300"
                />
                <button className="px-6 py-3 bg-gradient-secondary hover:bg-gradient-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-theme-accent-800 bg-theme-accent-950/50 backdrop-blur-sm">
          <div className="container py-6 px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-theme-accent-500 text-center md:text-left">
                &copy; {new Date().getFullYear()} YeloCar. All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-sm text-theme-accent-500">
                <Link href="#" className="hover:text-theme-secondary-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-theme-secondary-400 transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link href="#" className="hover:text-theme-secondary-400 transition-colors duration-300">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
