"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/firebase/config"
import { authUtils } from "@/lib/auth-utils"
import { Loader2, Shield, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AdminRouteProps {
  children: React.ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser)
          const adminStatus = await authUtils.isAdmin(currentUser.uid)
          setIsAdmin(adminStatus)

          if (!adminStatus) {
            setError("Access denied. Admin privileges required.")
            setTimeout(() => {
              router.push("/") // Redirect non-admin users after showing error
            }, 2000)
          }
        } else {
          setError("Authentication required.")
          setTimeout(() => {
            router.push("/auth/signin") // Redirect unauthenticated users
          }, 1000)
        }
      } catch (err) {
        console.error("Error checking admin status:", err)
        setError("Failed to verify admin access. Please try again.")
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-800 p-8">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative">
              <Shield className="h-12 w-12 text-red-500" />
              <Loader2 className="h-6 w-6 text-white animate-spin absolute -top-1 -right-1" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">Verifying Access</h2>
              <p className="text-gray-400">Checking admin privileges...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-800 p-8 max-w-md">
          <CardContent className="flex flex-col items-center gap-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
              <p className="text-gray-400 mb-4">{error}</p>
              <div className="flex gap-2">
                <Button onClick={() => router.push("/auth/signin")} className="bg-red-500 hover:bg-red-600">
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Go Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return <>{children}</>
}
