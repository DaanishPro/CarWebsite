import type { User } from "firebase/auth"
import { ref, get, set } from "firebase/database"
import { realtimeDb } from "@/firebase/config"

export interface UserProfile {
  uid: string
  email: string | null
  fullName: string
  phoneNumber: string
  role: "admin" | "buyer"
  createdAt: string
  updatedAt?: string
}

export const authUtils = {
  // Create user profile with role
  createUserProfile: async (
    user: User,
    additionalData: {
      fullName: string
      phoneNumber: string
      role?: "admin" | "buyer"
    },
  ): Promise<boolean> => {
    try {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        fullName: additionalData.fullName,
        phoneNumber: additionalData.phoneNumber,
        role: additionalData.role || "buyer",
        createdAt: new Date().toISOString(),
      }

      const userRef = ref(realtimeDb, `users/${user.uid}`)
      await set(userRef, userProfile)
      return true
    } catch (error) {
      console.error("Error creating user profile:", error)
      return false
    }
  },

  // Get user profile with role
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const userRef = ref(realtimeDb, `users/${uid}`)
      const snapshot = await get(userRef)

      if (snapshot.exists()) {
        return snapshot.val() as UserProfile
      }
      return null
    } catch (error) {
      console.error("Error getting user profile:", error)
      return null
    }
  },

  // Check if user is admin
  isAdmin: async (uid: string): Promise<boolean> => {
    try {
      const profile = await authUtils.getUserProfile(uid)
      return profile?.role === "admin"
    } catch (error) {
      console.error("Error checking admin status:", error)
      return false
    }
  },

  // Update user role (admin only)
  updateUserRole: async (uid: string, role: "admin" | "buyer"): Promise<boolean> => {
    try {
      const userRef = ref(realtimeDb, `users/${uid}`)
      const snapshot = await get(userRef)

      if (snapshot.exists()) {
        const userData = snapshot.val()
        await set(userRef, {
          ...userData,
          role,
          updatedAt: new Date().toISOString(),
        })
        return true
      }
      return false
    } catch (error) {
      console.error("Error updating user role:", error)
      return false
    }
  },
}
