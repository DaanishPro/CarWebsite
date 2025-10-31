"use client"
import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Toaster } from "react-hot-toast"
import AuthProvider from "@/context/AuthContext"
import { usePathname } from "next/navigation" // 👈 Added this line

const inter = Inter({ subsets: ["latin"] })

export const md: Metadata = {
  title: "YeloCar - Sell your cars with high potential",
  description: "A modern car selling platform built with Next.js and Firebase.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith("/admin") // 👈 Detect admin pages

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* 👇 Navbar and Footer only visible for non-admin routes */}
          {!isAdminPage && <Navbar />}
          <main className="flex-1">{children}</main>
          {!isAdminPage && <Footer />}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  )
}