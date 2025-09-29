"use client"

import { useState, useEffect } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebase/config"
import { authUtils, type UserProfile } from "@/lib/auth-utils"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        const profile = await authUtils.getUserProfile(currentUser.uid)
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return {
    user,
    userProfile,
    loading,
    isAdmin: userProfile?.role === "admin",
    isBuyer: userProfile?.role === "buyer",
  }
}
