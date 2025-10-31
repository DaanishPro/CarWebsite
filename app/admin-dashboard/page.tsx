"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  const { user, userProfile, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/signin")
        return
      }

      if (!isAdmin) {
        router.push("/")
        return
      }
    }
  }, [user, userProfile, loading, isAdmin,router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return <AdminDashboard />
}
