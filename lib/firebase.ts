import {
  ref,
  set,
  get,
  push,
  remove,
  onValue,
  type DataSnapshot,
  query,
  orderByChild,
  limitToLast,
} from "firebase/database"
import { realtimeDb } from "@/firebase/config"
import { toast } from "react-hot-toast"

interface UserData {
  uid: string
  email: string
  fullName: string
  phoneNumber: string
  createdAt: string
}

interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
  createdAt: string
}

interface FeatureInteraction {
  userId: string
  featureId: string
  action: "view" | "like" | "share" | "contact"
  timestamp: string
}

interface BookingFormData {
  fullName: string
  phoneNumber: string
  emailAddress: string
  carModel: string
  preferredVariant: string
  bookingDate: string
  city: string
  paymentPreference: string
  agreedToTerms: boolean
  sendUpdates: boolean
  createdAt: string
}

export const databaseUtils = {
  // Save user data to Realtime Database
  saveUserData: async (userData: UserData): Promise<boolean> => {
    try {
      if (!navigator.onLine) {
        throw new Error("You are offline. Please check your internet connection.")
      }

      const userRef = ref(realtimeDb, `users/${userData.uid}`)
      await set(userRef, {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      toast.success("User data saved successfully!")
      return true
    } catch (error: any) {
      console.error("Error saving user data:", error)
      toast.error(error.message || "Failed to save user data")
      return false
    }
  },

  // Get user data from Realtime Database
  getUserData: async (uid: string): Promise<UserData | null> => {
    try {
      if (!navigator.onLine) {
        throw new Error("You are offline. Please check your internet connection.")
      }

      const userRef = ref(realtimeDb, `users/${uid}`)
      const snapshot = await get(userRef)

      if (snapshot.exists()) {
        return snapshot.val() as UserData
      }

      return null
    } catch (error: any) {
      console.error("Error getting user data:", error)
      toast.error(error.message || "Failed to get user data")
      return null
    }
  },

  // Update user data in Realtime Database
  updateUserData: async (uid: string, updates: Partial<UserData>): Promise<boolean> => {
    try {
      if (!navigator.onLine) {
        throw new Error("You are offline. Please check your internet connection.")
      }

      const userRef = ref(realtimeDb, `users/${uid}`)
      await set(userRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      })

      toast.success("User data updated successfully!")
      return true
    } catch (error: any) {
      console.error("Error updating user data:", error)
      toast.error(error.message || "Failed to update user data")
      return false
    }
  },

  // Delete user data from Realtime Database
  deleteUserData: async (uid: string): Promise<boolean> => {
    try {
      if (!navigator.onLine) {
        throw new Error("You are offline. Please check your internet connection.")
      }

      const userRef = ref(realtimeDb, `users/${uid}`)
      await remove(userRef)

      toast.success("User data deleted successfully!")
      return true
    } catch (error: any) {
      console.error("Error deleting user data:", error)
      toast.error(error.message || "Failed to delete user data")
      return false
    }
  },

  // Listen to user data changes in real-time
  listenToUserData: (uid: string, callback: (data: UserData | null) => void) => {
    try {
      const userRef = ref(realtimeDb, `users/${uid}`)

      const unsubscribe = onValue(
        userRef,
        (snapshot: DataSnapshot) => {
          if (snapshot.exists()) {
            callback(snapshot.val() as UserData)
          } else {
            callback(null)
          }
        },
        (error) => {
          console.error("Error listening to user data:", error)
          toast.error("Failed to listen to user data changes")
          callback(null)
        },
      )

      return unsubscribe
    } catch (error: any) {
      console.error("Error setting up user data listener:", error)
      toast.error("Failed to set up user data listener")
      return () => {}
    }
  },

  // ADDED: New function to fetch all users for the admin dashboard
  getAllUsers: async (): Promise<UserData[]> => {
    try {
      if (!navigator.onLine) {
        throw new Error("You are offline. Please check your internet connection.")
      }
      const usersRef = ref(realtimeDb, "users")
      const snapshot = await get(usersRef)
      if (snapshot.exists()) {
        const data = snapshot.val()
        // Convert the object of users into an array and return
        return Object.values(data)
      }
      return []
    } catch (error: any) {
      console.error("Error fetching all users:", error)
      toast.error(error.message || "Failed to fetch users.")
      return []
    }
  },

  // Save contact form data
  saveContactForm: async (formData: ContactFormData): Promise<boolean> => {
    try {
      if (!navigator.onLine) {
        throw new Error("You are offline. Please check your internet connection.")
      }

      const contactRef = ref(realtimeDb, "contactForms")
      const newContactRef = push(contactRef)

      await set(newContactRef, {
        ...formData,
        createdAt: new Date().toISOString(),
        id: newContactRef.key,
      })

      toast.success("Contact form submitted successfully!")
      return true
    } catch (error: any) {
      console.error("Error saving contact form:", error)
      toast.error(error.message || "Failed to submit contact form")
      return false
    }
  },

  // Save contact message in the specified format: message/[user_id]/FullName,Contactno.,Email,Message
  saveContactMessage: async (
    userId: string,
    messageData: {
      FullName: string
      Contactno: string
      Email: string
      Message: string
      createdAt: string
    },
  ): Promise<boolean> => {
    try {
      if (!navigator.onLine) {
        throw new Error("You are offline. Please check your internet connection.")
      }

      const messageRef = ref(realtimeDb, `message/${userId}`)

      await set(messageRef, messageData)

      return true
    } catch (error: any) {
      console.error("Error saving contact message:", error)
      toast.error(error.message || "Failed to save contact message")
      return false
    }
  },

  // Get all contact forms (admin function)
  getContactForms: async (): Promise<ContactFormData[]> => {
    try {
      if (!navigator.onLine) {
        throw new Error("You are offline. Please check your internet connection.")
      }

      const contactRef = ref(realtimeDb, "contactForms")
      const contactQuery = query(contactRef, orderByChild("createdAt"), limitToLast(50))
      const snapshot = await get(contactQuery)

      if (snapshot.exists()) {
        const forms: ContactFormData[] = []
        snapshot.forEach((childSnapshot) => {
          forms.push(childSnapshot.val() as ContactFormData)
        })
        return forms.reverse() // Most recent first
      }

      return []
    } catch (error: any) {
      console.error("Error getting contact forms:", error)
      toast.error(error.message || "Failed to get contact forms")
      return []
    }
  },

  // Listen to contact forms in real-time (admin function)
  listenToContactForms: (callback: (forms: ContactFormData[]) => void) => {
    try {
      const contactRef = ref(realtimeDb, "contactForms")
      const contactQuery = query(contactRef, orderByChild("createdAt"), limitToLast(50))

      const unsubscribe = onValue(
        contactQuery,
        (snapshot: DataSnapshot) => {
          if (snapshot.exists()) {
            const forms: ContactFormData[] = []
            snapshot.forEach((childSnapshot) => {
              forms.push(childSnapshot.val() as ContactFormData)
            })
            callback(forms.reverse()) // Most recent first
          } else {
            callback([])
          }
        },
        (error) => {
          console.error("Error listening to contact forms:", error)
          toast.error("Failed to listen to contact forms")
          callback([])
        },
      )

      return unsubscribe
    } catch (error: any) {
      console.error("Error setting up contact forms listener:", error)
      toast.error("Failed to set up contact forms listener")
      return () => {}
    }
  },

  // Save feature interaction
  saveFeatureInteraction: async (interaction: FeatureInteraction): Promise<boolean> => {
    try {
      if (!navigator.onLine) {
        throw new Error("You are offline. Please check your internet connection.")
      }

      const interactionRef = ref(realtimeDb, "featureInteractions")
      const newInteractionRef = push(interactionRef)

      await set(newInteractionRef, {
        ...interaction,
        timestamp: new Date().toISOString(),
        id: newInteractionRef.key,
      })

      return true
    } catch (error: any) {
      console.error("Error saving feature interaction:", error)
      return false
    }
  },

  // Get feature interactions for analytics
  getFeatureInteractions: async (featureId?: string): Promise<FeatureInteraction[]> => {
    try {
      if (!navigator.onLine) {
        throw new Error("You are offline. Please check your internet connection.")
      }

      const interactionRef = ref(realtimeDb, "featureInteractions")
      const interactionQuery = query(interactionRef, orderByChild("timestamp"), limitToLast(100))
      const snapshot = await get(interactionQuery)

      if (snapshot.exists()) {
        const interactions: FeatureInteraction[] = []
        snapshot.forEach((childSnapshot) => {
          const interaction = childSnapshot.val() as FeatureInteraction
          if (!featureId || interaction.featureId === featureId) {
            interactions.push(interaction)
          }
        })
        return interactions.reverse() // Most recent first
      }

      return []
    } catch (error: any) {
      console.error("Error getting feature interactions:", error)
      return []
    }
  },

  // Listen to feature interactions in real-time
  listenToFeatureInteractions: (callback: (interactions: FeatureInteraction[]) => void) => {
    try {
      const interactionRef = ref(realtimeDb, "featureInteractions")
      const interactionQuery = query(interactionRef, orderByChild("timestamp"), limitToLast(100))

      const unsubscribe = onValue(
        interactionQuery,
        (snapshot: DataSnapshot) => {
          if (snapshot.exists()) {
            const interactions: FeatureInteraction[] = []
            snapshot.forEach((childSnapshot) => {
              interactions.push(childSnapshot.val() as FeatureInteraction)
            })
            callback(interactions.reverse()) // Most recent first
          } else {
            callback([])
          }
        },
        (error) => {
          console.error("Error listening to feature interactions:", error)
          callback([])
        },
      )

      return unsubscribe
    } catch (error: any) {
      console.error("Error setting up feature interactions listener:", error)
      return () => {}
    }
  },

  // Check database connectivity
  checkConnectivity: async (): Promise<boolean> => {
    try {
      const testRef = ref(realtimeDb, ".info/connected")
      const snapshot = await get(testRef)
      return snapshot.val() === true
    } catch (error) {
      console.error("Database connectivity check failed:", error)
      return false
    }
  },

  // Listen to database connectivity
  listenToConnectivity: (callback: (isConnected: boolean) => void) => {
    try {
      const connectedRef = ref(realtimeDb, ".info/connected")

      const unsubscribe = onValue(
        connectedRef,
        (snapshot: DataSnapshot) => {
          callback(snapshot.val() === true)
        },
        (error) => {
          console.error("Error listening to connectivity:", error)
          callback(false)
        },
      )

      return unsubscribe
    } catch (error: any) {
      console.error("Error setting up connectivity listener:", error)
      return () => {}
    }
  },

  // New function to save car booking data
  saveBookingData: async (userId: string, bookingData: BookingFormData): Promise<boolean> => {
    try {
      if (!navigator.onLine) {
        throw new Error("You are offline. Please check your internet connection.")
      }

      const bookingRef = ref(realtimeDb, `BookingCar/${userId}`)
      const newBookingRef = push(bookingRef)

      await set(newBookingRef, {
        ...bookingData,
        createdAt: new Date().toISOString(),
        id: newBookingRef.key,
      })

      toast.success("Booking submitted successfully!")
      return true
    } catch (error: any) {
      console.error("Error saving booking data:", error)
      toast.error(error.message || "Failed to submit booking")
      return false
    }
  },
}

export default databaseUtils
