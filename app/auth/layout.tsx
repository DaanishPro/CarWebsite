import type React from "react"
import { Toaster } from "react-hot-toast" // For toast notifications
import AuthProvider from "@/context/AuthContext" // Import AuthProvider

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {" "}
          {/* AuthProvider is needed here too for auth pages */}
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
