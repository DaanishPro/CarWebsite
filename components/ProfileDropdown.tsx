"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  LogOut,
  UserIcon,
  Trash2,
  Car,
  Star,
  Crown,
  Shield,
  Edit3,
  Save,
  X,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  DollarSign,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { signOut } from "firebase/auth"
import { auth, realtimeDb } from "@/firebase/config"
import { ref, get, set, remove, onValue, off } from "firebase/database"
import { toast } from "react-hot-toast"
import { useState, useMemo, useEffect } from "react"
import allCars, { CarData } from "@/lib/car-data"

interface ProfileDropdownProps {
  isMobile?: boolean
}

interface UserProfile {
  fullName: string
  phoneNo: string
  email: string
}

interface BookedCar {
  bookingId: string
  carName: string
  carImage: string
  carModel: string
  carYear: string
  bookingDate: string
  pickupLocation: string
  status: string
  ownerName?: string
  price?: number
  discount?: number
}

export default function ProfileDropdown({ isMobile = false }: ProfileDropdownProps) {
  const { user, userProfile, loading, deleteUserAccount } = useAuth()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isVehiclesModalOpen, setIsVehiclesModalOpen] = useState(false)
  const [profileData, setProfileData] = useState<UserProfile>({ fullName: "", phoneNo: "", email: "" })
  const [bookedCars, setBookedCars] = useState<BookedCar[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => setIsClient(true), [])

  const { displayName, avatarFallback } = useMemo(() => {
    if (!userProfile && !user) return { displayName: "User", avatarFallback: "U" }
    const name = userProfile?.fullName || profileData?.fullName || user?.email || "User"
    const fallback = name.charAt(0).toUpperCase()
    return { displayName: name, avatarFallback: fallback }
  }, [userProfile, user, profileData])

  // Load profile
  useEffect(() => {
    if (user && isProfileModalOpen) {
      const userRef = ref(realtimeDb, `users/${user.uid}`)
      const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          setProfileData({
            fullName: data.fullName || "",
            phoneNo: data.phoneNo || data.phoneNumber || "",
            email: data.email || user.email || "",
          })
        } else {
          setProfileData({ fullName: "", phoneNo: "", email: user.email || "" })
        }
      })
      return () => off(userRef, "value", unsubscribe)
    }
  }, [user, isProfileModalOpen])

  // Fetch booked vehicles in real time
  useEffect(() => {
    if (user && isVehiclesModalOpen) {
      setIsLoadingVehicles(true)
      const bookingsRef = ref(realtimeDb, `BookingCar/${user.uid}`)

      const unsubscribe = onValue(
        bookingsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const bookingsData = snapshot.val()
            const formattedBookings: BookedCar[] = Object.entries(bookingsData)
              .map(([id, data]: any) => ({
                bookingId: id,
                carName: data.carName || data.name || "Unknown Car",
                carImage: data.carImage || data.image || "/placeholder.png",
                carModel: data.carModel || data.model || "N/A",
                carYear: data.carYear || data.year || "2024",
                bookingDate: data.bookingDate || data.date || "Not specified",
                pickupLocation: data.pickupLocation || data.location || "Unknown",
                status: data.status || "Confirmed",
                ownerName: data.ownerName || profileData.fullName || "User",
                price: data.price || 0,
                discount: data.discount || 0,
              }))
              // Sort recent first
              .sort(
                (a, b) =>
                  new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
              )

            setBookedCars(formattedBookings)
          } else {
            setBookedCars([])
          }
          setIsLoadingVehicles(false)
        },
        (error) => {
          console.error("Error loading bookings:", error)
          toast.error("Failed to load bookings")
          setIsLoadingVehicles(false)
        }
      )

      return () => off(bookingsRef, "value", unsubscribe)
    }
  }, [user, isVehiclesModalOpen])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success("Signed out successfully!")
    } catch (error: any) {
      toast.error(`Sign out failed: ${error.message}`)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      await deleteUserAccount()
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      const userRef = ref(realtimeDb, `users/${user.uid}`)
      await set(userRef, { ...profileData, updatedAt: new Date().toISOString() })
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteBooking = async (bookingId: string) => {
    if (!user) return
    if (window.confirm("Cancel this booking?")) {
      try {
        const bookingRef = ref(realtimeDb, `BookingCar/${user.uid}/${bookingId}`)
        await remove(bookingRef)
        toast.success("Booking cancelled successfully!")
      } catch {
        toast.error("Failed to cancel booking")
      }
    }
  }

  if (!isClient) return null
  if (!user) return null

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-12 w-12 rounded-full p-0 hover:bg-red-50 border-2 border-red-200 bg-white transition-all duration-300"
          >
            <Avatar className="h-10 w-10 ring-2 ring-red-500">
              <AvatarImage src={user.photoURL || undefined} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-800 text-white font-bold text-lg">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-80 p-4 shadow-2xl border-0 bg-white/95 backdrop-blur-sm"
          align="end"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-4 ring-red-100 shadow-lg">
                  <AvatarImage src={user.photoURL || undefined} alt={displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-800 text-white font-bold text-2xl">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base font-bold text-gray-900">{displayName}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsProfileModalOpen(true)}
            className="p-3 hover:bg-red-50 rounded-xl transition-all"
          >
            <UserIcon className="h-5 w-5 text-red-700 mr-3" />
            My Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setIsVehiclesModalOpen(true)}
            className="p-3 hover:bg-red-50 rounded-xl transition-all"
          >
            <Car className="h-5 w-5 text-red-700 mr-3" />
            My Vehicles
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleSignOut} className="p-3 hover:bg-red-50 rounded-xl transition-all">
            <LogOut className="h-5 w-5 text-red-700 mr-3" />
            Sign Out
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDeleteAccount}
            className="p-3 hover:bg-red-50 text-red-700 rounded-xl transition-all"
          >
            <Trash2 className="h-5 w-5 text-red-700 mr-3" />
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Vehicle Modal */}
      <Dialog open={isVehiclesModalOpen} onOpenChange={setIsVehiclesModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <Car className="h-6 w-6" />
                My Vehicle Bookings
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-6">
            {isLoadingVehicles ? (
              <p className="text-center text-gray-600">Loading your bookings...</p>
            ) : bookedCars.length === 0 ? (
              <p className="text-center text-gray-600">No bookings found.</p>
            ) : (
              <div className="space-y-4">
                {bookedCars.map((car) => (
                  <Card key={car.bookingId} className="border-l-4 border-red-500 shadow-sm hover:shadow-lg transition">
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row items-start gap-4">
                        <img
                          src={car.carImage}
                          alt={car.carName}
                          className="w-40 h-28 object-cover rounded-lg bg-gray-100"
                        />
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900">{car.carName}</h4>
                          <p className="text-gray-600">{car.carModel} ({car.carYear})</p>
                          <p className="text-sm text-gray-700 mt-1">Booked by: {car.ownerName}</p>
                          <p className="text-sm text-gray-700">Pickup: {car.pickupLocation}</p>
                          <p className="text-sm text-gray-700">Booking Date: {car.bookingDate}</p>
                          <p className="text-sm font-semibold text-red-600 mt-1">
                            ₹{car.price?.toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteBooking(car.bookingId)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
