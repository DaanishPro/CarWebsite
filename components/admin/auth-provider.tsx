"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"
import { auth, db } from "@/firebase/config"
import { databaseUtils } from "@/lib/firebase"
import { toast } from "react-hot-toast"

interface UserProfile {
  uid: string
  email: string | null
  fullName: string
  phoneNumber: string
  createdAt?: string
  updatedAt?: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  deleteUserAccount: () => Promise<void>
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch user profile with optimized loading
  const fetchUserProfile = async (currentUser: User) => {
    try {
      // Set loading to false immediately for better UX
      setLoading(false)

      // Try to get user data from Realtime Database first (faster)
      const realtimeData = await databaseUtils.getUserData(currentUser.uid)

      if (realtimeData) {
        setUserProfile(realtimeData)
        return
      }

      // Fallback to Firestore if Realtime Database doesn't have the data
      const docRef = doc(db, "users", currentUser.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const firestoreData = docSnap.data() as UserProfile

        // Save to Realtime Database for future use (async, don't wait)
        databaseUtils
          .saveUserData({
            uid: currentUser.uid,
            email: currentUser.email || "",
            fullName: firestoreData.fullName || "",
            phoneNumber: firestoreData.phoneNumber || "",
            createdAt: firestoreData.createdAt
              ? new Date(firestoreData.createdAt).toISOString()
              : new Date().toISOString(),
          })
          .catch(console.warn) // Don't block UI for this

        setUserProfile(firestoreData)
      } else {
        // If user exists in Auth but not in databases, create a placeholder profile
        const placeholderProfile = {
          uid: currentUser.uid,
          email: currentUser.email,
          fullName: "",
          phoneNumber: "",
        }
        setUserProfile(placeholderProfile)
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error)

      // Set a basic profile if we can't fetch from database
      setUserProfile({
        uid: currentUser.uid,
        email: currentUser.email,
        fullName: "",
        phoneNumber: "",
      })

      if (error.message?.includes("offline")) {
        toast.error("You are offline. Some features may be limited.", { duration: 3000 })
      } else if (error.code === "unavailable") {
        toast.error("Failed to connect to database. Please check your internet connection.", { duration: 3000 })
      }
    }
  }

  useEffect(() => {
    let isMounted = true

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return

      setUser(currentUser)

      if (currentUser) {
        // Start fetching profile immediately
        fetchUserProfile(currentUser)
      } else {
        setUserProfile(null)
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      toast.error("You must be logged in to update your profile.")
      return
    }

    if (!navigator.onLine) {
      toast.error("You are offline. Please check your internet connection.", { duration: 3000 })
      return
    }

    try {
      // Update in Firestore (existing functionality)
      const userDocRef = doc(db, "users", user.uid)
      await setDoc(userDocRef, { ...userProfile, ...data }, { merge: true })

      // Update in Realtime Database (new functionality)
      const updateData = {
        uid: user.uid,
        email: user.email || "",
        fullName: data.fullName || userProfile?.fullName || "",
        phoneNumber: data.phoneNumber || userProfile?.phoneNumber || "",
        updatedAt: new Date().toISOString(),
      }

      const dbSuccess = await databaseUtils.updateUserData(user.uid, updateData)

      if (dbSuccess) {
        setUserProfile((prev) => (prev ? { ...prev, ...data } : null))
        toast.success("Profile updated successfully!")
      } else {
        // If Realtime DB fails, still update Firestore and show warning
        setUserProfile((prev) => (prev ? { ...prev, ...data } : null))
        toast.success("Profile updated successfully!")
        toast.error("Some features may be limited due to database connection issues.")
      }
    } catch (error: any) {
      console.error("Error updating user profile:", error)

      if (error.message?.includes("offline")) {
        toast.error("You are offline. Please check your internet connection.", { duration: 3000 })
      } else if (error.code === "unavailable") {
        toast.error("Failed to connect to database. Please check your internet connection.", { duration: 3000 })
      } else {
        toast.error("Failed to update profile.")
      }
    }
  }

  const deleteUserAccount = async () => {
    if (!user) {
      toast.error("You must be logged in to delete your account.")
      return
    }

    if (!navigator.onLine) {
      toast.error("You are offline. Please check your internet connection.", { duration: 3000 })
      return
    }

    try {
      // Delete from Realtime Database first
      await databaseUtils.deleteUserData(user.uid)

      // Delete from Firestore
      const userDocRef = doc(db, "users", user.uid)
      await deleteDoc(userDocRef)

      // Delete user from Firebase Auth
      await user.delete()
      toast.success("Account deleted successfully!")
      // Firebase onAuthStateChanged will handle setting user to null
    } catch (error: any) {
      console.error("Error deleting user account:", error)

      if (error.message?.includes("offline")) {
        toast.error("You are offline. Please check your internet connection.", { duration: 3000 })
      } else if (error.code === "unavailable") {
        toast.error("Failed to connect to database. Please check your internet connection.", { duration: 3000 })
      } else if (error.code === "auth/requires-recent-login") {
        toast.error("Please re-authenticate to delete your account.", { duration: 3000 })
      } else {
        toast.error(`Failed to delete account: ${error.message}`)
      }
    }
  }

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        updateUserProfile,
        deleteUserAccount,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
