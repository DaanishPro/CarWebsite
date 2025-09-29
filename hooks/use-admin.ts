"use client"

import { useState, useEffect } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebase/config"
import { authUtils, type UserProfile } from "@/lib/auth-utils"

export function useAdmin() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        try {
          const profile = await authUtils.getUserProfile(currentUser.uid)
          setUserProfile(profile)
          setIsAdmin(profile?.role === "admin")
        } catch (error) {
          console.error("Error fetching user profile:", error)
          setUserProfile(null)
          setIsAdmin(false)
        }
      } else {
        setUserProfile(null)
        setIsAdmin(false)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const refreshProfile = async () => {
    if (user) {
      setLoading(true)
      try {
        const profile = await authUtils.getUserProfile(user.uid)
        setUserProfile(profile)
        setIsAdmin(profile?.role === "admin")
      } catch (error) {
        console.error("Error refreshing profile:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  return {
    user,
    userProfile,
    loading,
    isAdmin,
    refreshProfile,
  }
}
