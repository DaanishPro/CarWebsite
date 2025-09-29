import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
// import ConnectivityStatus from "@/components/ConnectivityStatus"
import { Toaster } from "react-hot-toast" // For toast notifications
import AuthProvider from "@/context/AuthContext" // Import AuthProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "YeloCar - Sell your cars with high potential",
  description: "A modern car selling platform built with Next.js and Firebase.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {" "}
          {/* Wrap children with AuthProvider */}
          {/* <ConnectivityStatus /> */}
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
