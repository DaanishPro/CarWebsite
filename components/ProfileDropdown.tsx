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
  Fuel,
  Settings,
  Zap,
  Tag,
  DollarSign,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { signOut } from "firebase/auth"
import { auth, realtimeDb } from "@/firebase/config"
import { ref, get, set, remove, onValue, off } from "firebase/database"
import { toast } from "react-hot-toast"
import { useState, useMemo, useEffect } from "react"
// Import the allCars data from the new lib/car-data file
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
  carId: string
  carName: string
  carImage: string
  carModel: string
  carYear: string
  bookingDate: string
  pickupLocation: string
  status: string
<<<<<<< HEAD
=======
  ownerName?: string // ADDED: To store the name from the booking form
>>>>>>> 5d1dd60 (Updated booked cars module)
  price?: number
  discount?: number
  fuelType?: string
  mileage?: string
  transmission?: string
  location?: string
<<<<<<< HEAD
  mainFeatures?: { name: string; icon: React.ElementType }[] // Add mainFeatures
=======
  mainFeatures?: { name: string; icon: React.ElementType }[]
>>>>>>> 5d1dd60 (Updated booked cars module)
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

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Memoize display name and avatar fallback for better performance
  const { displayName, avatarFallback } = useMemo(() => {
    if (!userProfile && !user) return { displayName: "User", avatarFallback: "U" }

    const name = userProfile?.fullName || profileData?.fullName || user?.email || "User"
    const fallback = name.charAt(0).toUpperCase()

    return { displayName: name, avatarFallback: fallback }
  }, [userProfile, user, profileData])

  // Load user profile data from Firebase
  useEffect(() => {
    if (user && isProfileModalOpen) {
      const userRef = ref(realtimeDb, `users/${user.uid}`)
      const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          setProfileData({
            fullName: data.fullName || "",
<<<<<<< HEAD
            phoneNo: data.phoneNo || data.phoneNumber || "", // Corrected logic to handle both "phoneNo" and "phoneNumber"
=======
            phoneNo: data.phoneNo || data.phoneNumber || "",
>>>>>>> 5d1dd60 (Updated booked cars module)
            email: data.email || user.email || "",
          })
        } else {
          setProfileData({
            fullName: "",
            phoneNo: "",
            email: user.email || "",
          })
        }
      })

      return () => off(userRef, "value", unsubscribe)
    }
  }, [user, isProfileModalOpen])

<<<<<<< HEAD
  // Corrected logic to fetch user's booked vehicles and enrich data
=======
  // UPDATED: Fetches user's booked vehicles and enriches data, including ownerName
>>>>>>> 5d1dd60 (Updated booked cars module)
  useEffect(() => {
    if (user && isVehiclesModalOpen) {
      setIsLoadingVehicles(true)
      const bookingsRef = ref(realtimeDb, `BookingCar/${user.uid}`)

<<<<<<< HEAD
      const unsubscribe = onValue(bookingsRef, (snapshot) => {
        if (snapshot.exists()) {
          const userBookingsData = snapshot.val()
          const userBookings: BookedCar[] = Object.keys(userBookingsData).map((carId) => {
            const booking = userBookingsData[carId]
            // Find the full car details from the imported allCars array
            const carDetails = allCars.find(car => car.id === carId)

            return {
              carId,
              carName: carDetails?.name || booking.carName || "Unknown Car",
              carImage: carDetails?.imageSrc || booking.carImage || "/placeholder.png?height=120&width=180",
              carModel: carDetails?.name || booking.carModel || "",
              carYear: carDetails?.year ? String(carDetails.year) : booking.carYear || "",
              bookingDate: booking.bookingDate || booking.date || "Date not specified",
              pickupLocation: booking.pickupLocation || booking.location || "Location not specified",
              status: booking.status || "Confirmed",
              price: carDetails?.price || booking.price || 0,
              discount: carDetails?.discount || booking.discount || 0,
              fuelType: carDetails?.fuelType || booking.fuelType || "Petrol",
              mileage: carDetails?.mileage || booking.mileage || "N/A",
              transmission: carDetails?.transmission || booking.transmission || "Manual",
              location: carDetails?.location || booking.location || "Mumbai",
              mainFeatures: carDetails?.mainFeatures || []
            }
          })
          setBookedCars(userBookings)
        } else {
          setBookedCars([])
        }
        setIsLoadingVehicles(false)
      }, (error) => {
        console.error("Error loading bookings:", error)
        toast.error("Failed to load your bookings")
        setIsLoadingVehicles(false)
      })
=======
      const unsubscribe = onValue(
        bookingsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const userBookingsData = snapshot.val()
            const userBookings: BookedCar[] = Object.keys(userBookingsData).map((carId) => {
              const booking = userBookingsData[carId]
              const carDetails = allCars.find((car) => car.id === carId)

              return {
                carId,
                carName: carDetails?.name || booking.carName || "Unknown Car",
                carImage: carDetails?.imageSrc || booking.carImage || "/placeholder.png?height=120&width=180",
                carModel: carDetails?.name || booking.carModel || "",
                carYear: carDetails?.year ? String(carDetails.year) : booking.carYear || "",
                bookingDate: booking.bookingDate || booking.date || "Date not specified",
                pickupLocation: booking.pickupLocation || booking.location || "Location not specified",
                status: booking.status || "Confirmed",
                ownerName: booking.ownerName || "", // ADDED: Get ownerName from booking data
                price: carDetails?.price || booking.price || 0,
                discount: carDetails?.discount || booking.discount || 0,
                fuelType: carDetails?.fuelType || booking.fuelType || "Petrol",
                mileage: carDetails?.mileage || booking.mileage || "N/A",
                transmission: carDetails?.transmission || booking.transmission || "Manual",
                location: carDetails?.location || booking.location || "Mumbai",
                mainFeatures: carDetails?.mainFeatures || [],
              }
            })
            setBookedCars(userBookings)
          } else {
            setBookedCars([])
          }
          setIsLoadingVehicles(false)
        },
        (error) => {
          console.error("Error loading bookings:", error)
          toast.error("Failed to load your bookings")
          setIsLoadingVehicles(false)
        }
      )
>>>>>>> 5d1dd60 (Updated booked cars module)

      return () => off(bookingsRef, "value", unsubscribe)
    }
  }, [user, isVehiclesModalOpen])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success("Signed out successfully!")
    } catch (error: any) {
      console.error("Error signing out:", error)
      toast.error(`Sign out failed: ${error.message}`)
    }
  }

  const handleDeleteAccount = async () => {
<<<<<<< HEAD
    if (typeof window !== 'undefined' && window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
=======
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
>>>>>>> 5d1dd60 (Updated booked cars module)
      await deleteUserAccount()
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const userRef = ref(realtimeDb, `users/${user.uid}`)
      await set(userRef, {
        ...profileData,
        updatedAt: new Date().toISOString(),
      })

      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteBooking = async (carId: string) => {
    if (!user) return

<<<<<<< HEAD
    if (typeof window !== 'undefined' && window.confirm("Are you sure you want to cancel this booking?")) {
=======
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to cancel this booking?")) {
>>>>>>> 5d1dd60 (Updated booked cars module)
      try {
        const bookingRef = ref(realtimeDb, `BookingCar/${user.uid}/${carId}`)
        await remove(bookingRef)

        toast.success("Booking cancelled successfully!")
      } catch (error: any) {
        console.error("Error deleting booking:", error)
        toast.error("Failed to cancel booking")
      }
    }
  }

<<<<<<< HEAD
  // Don't render anything during server-side rendering
=======
>>>>>>> 5d1dd60 (Updated booked cars module)
  if (!isClient) {
    return <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
  }

  if (loading && !user) {
    return <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
  }

  if (!user) {
    return null
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
<<<<<<< HEAD
            className={`relative h-12 w-12 rounded-full p-0 hover:bg-red-50 hover:border-red-300 border-2 border-red-200 transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white ${isMobile ? "w-full justify-start h-16 px-4" : ""
              }`}
          >
            <div>
              <Avatar className="h-10 w-10 ring-2 ring-red-500 hover:ring-red-600 transition-all duration-300 shadow-lg">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt={displayName} className="object-cover" />
=======
            className={`relative h-12 w-12 rounded-full p-0 hover:bg-red-50 hover:border-red-300 border-2 border-red-200 transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white ${
              isMobile ? "w-full justify-start h-16 px-4" : ""
            }`}
          >
            <div>
              <Avatar className="h-10 w-10 ring-2 ring-red-500 hover:ring-red-600 transition-all duration-300 shadow-lg">
                <AvatarImage src={user.photoURL || undefined} alt={displayName} className="object-cover" />
>>>>>>> 5d1dd60 (Updated booked cars module)
                <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-800 font-bold text-lg text-white">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              {isMobile && <span className="ml-4 text-base font-semibold text-gray-800">{displayName}</span>}

<<<<<<< HEAD
              {
                (userProfile?.fullName || profileData?.fullName) && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-1.5 shadow-lg ring-2 ring-white">
                    <Crown className="h-4 w-4 text-white fill-current" />
                  </div>
                )
              }
=======
              {(userProfile?.fullName || profileData?.fullName) && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-1.5 shadow-lg ring-2 ring-white">
                  <Crown className="h-4 w-4 text-white fill-current" />
                </div>
              )}
>>>>>>> 5d1dd60 (Updated booked cars module)
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-80 p-4 shadow-2xl border-0 bg-white/95 backdrop-blur-sm"
          align="end"
          forceMount
          sideOffset={12}
        >
          <DropdownMenuLabel className="font-normal p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-4 ring-red-100 shadow-lg">
<<<<<<< HEAD
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt={displayName} className="object-cover" />
=======
                  <AvatarImage src={user.photoURL || undefined} alt={displayName} className="object-cover" />
>>>>>>> 5d1dd60 (Updated booked cars module)
                  <AvatarFallback className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white font-bold text-2xl">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-base font-bold leading-none text-gray-900">{displayName}</p>
                  <p className="text-sm leading-none text-gray-600 mt-2">{user.email}</p>
                </div>
                {(userProfile?.fullName || profileData?.fullName) && (
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-2 shadow-lg">
                    <Crown className="h-5 w-5 text-white fill-current" />
                  </div>
                )}
              </div>

              {(userProfile?.fullName || profileData?.fullName) && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 via-red-100 to-orange-50 p-4 rounded-xl border border-red-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-full p-1">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-bold text-red-800">Premium Member</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-red-50 rounded-xl transition-all duration-200 group"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center group-hover:from-red-200 group-hover:to-red-300 transition-all duration-200">
              <UserIcon className="h-5 w-5 text-red-700" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-gray-900">My Profile</span>
              <p className="text-xs text-gray-600 mt-1">Manage your account details</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setIsVehiclesModalOpen(true)}
            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-red-50 rounded-xl transition-all duration-200 group"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center group-hover:from-red-200 group-hover:to-red-300 transition-all duration-200">
              <Car className="h-5 w-5 text-red-700" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-gray-900">My Vehicles</span>
              <p className="text-xs text-gray-600 mt-1">View your car bookings</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            onClick={handleSignOut}
            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-red-50 rounded-xl transition-all duration-200 group"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center group-hover:from-red-200 group-hover:to-red-300 transition-all duration-200">
              <LogOut className="h-5 w-5 text-red-700" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-gray-900">Sign Out</span>
              <p className="text-xs text-gray-600 mt-1">Sign out of your account</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            onClick={handleDeleteAccount}
            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-red-50 rounded-xl transition-all duration-200 group"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center group-hover:from-red-200 group-hover:to-red-300 transition-all duration-200">
              <Trash2 className="h-5 w-5 text-red-700" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-red-700">Delete Account</span>
              <p className="text-xs text-red-600 mt-1">Permanently remove account</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="relative">
        {/* Profile Modal */}
        <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
          <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <DialogHeader className="relative z-10">
                <DialogTitle className="text-3xl font-bold flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <User className="h-7 w-7" />
                  </div>
                  My Profile
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                <Button
                  variant={isEditing ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2"
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </div>

              <div className="grid gap-6">
                <div className="space-y-3">
                  <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <User className="h-4 w-4 text-red-600" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, fullName: e.target.value }))}
                    disabled={!isEditing}
                    className="h-12 text-base border-2 focus:border-red-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phoneNo" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Phone className="h-4 w-4 text-red-600" />
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNo"
                    value={profileData.phoneNo}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, phoneNo: e.target.value }))}
                    disabled={!isEditing}
                    className="h-12 text-base border-2 focus:border-red-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Mail className="h-4 w-4 text-red-600" />
                    Email Address
                  </Label>
                  <Input id="email" value={profileData.email} disabled className="h-12 text-base bg-gray-50 border-2" />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold"
                  >
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

<<<<<<< HEAD
=======
        {/* My Vehicles Modal */}
>>>>>>> 5d1dd60 (Updated booked cars module)
        <Dialog open={isVehiclesModalOpen} onOpenChange={setIsVehiclesModalOpen}>
          <DialogContent className="sm:max-w-[800px] p-0 max-h-[85vh] overflow-hidden">
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <DialogHeader className="relative z-10">
                <DialogTitle className="text-3xl font-bold flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Car className="h-7 w-7" />
                  </div>
                  My Vehicle Bookings
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="p-8">
              {isLoadingVehicles ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-lg text-gray-700 font-medium">Loading your bookings...</span>
                  </div>
                </div>
              ) : bookedCars.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center">
                    <Car className="h-12 w-12 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Bookings Found</h3>
<<<<<<< HEAD
                  <p className="text-gray-600 text-lg">
                    You haven't booked any vehicles yet. Start exploring our amazing collection!
                  </p>
=======
                  <p className="text-gray-600 text-lg">You haven't booked any vehicles yet. Start exploring our amazing collection!</p>
>>>>>>> 5d1dd60 (Updated booked cars module)
                </div>
              ) : (
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                  {bookedCars.map((car) => (
                    <Card
                      key={car.carId}
                      className="border-l-4 border-l-red-500 hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                          <div className="relative flex-shrink-0">
                            <img
                              src={car.carImage || "/placeholder.svg"}
                              alt={car.carName}
                              className="w-48 h-32 object-cover rounded-xl bg-gray-100 shadow-md"
                            />
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                              {car.status}
                            </div>
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between w-full">
                              <div>
                                <h4 className="text-2xl font-bold text-gray-900">{car.carName}</h4>
                                <p className="text-base text-gray-600 font-medium">
                                  {car.carModel} ({car.carYear})
                                </p>
<<<<<<< HEAD
=======
                                {/* ADDED: Display for owner name */}
                                {car.ownerName && (
                                  <div className="flex items-center gap-2 mt-2 text-gray-700">
                                    <User className="h-4 w-4 text-red-600 flex-shrink-0" />
                                    <span className="font-medium text-sm">Booked by: {car.ownerName}</span>
                                  </div>
                                )}
>>>>>>> 5d1dd60 (Updated booked cars module)
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteBooking(car.carId)}
                                className="h-10 w-10 p-0 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300"
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="h-5 w-5 text-red-600" />
                              <span className="text-xl font-bold text-red-600">₹{car.price?.toLocaleString()}</span>
                              {car.discount && car.discount > 0 && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  ₹{((car.price || 0) + (car.discount || 0)).toLocaleString()}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Calendar className="h-4 w-4 text-red-600" />
                                <span className="font-medium">{car.bookingDate || "Date not specified"}</span>
                              </div>
                              {car.pickupLocation && (
                                <div className="flex items-center gap-2 text-gray-700">
                                  <MapPin className="h-4 w-4 text-red-600" />
                                  <span className="font-medium">{car.pickupLocation}</span>
                                </div>
                              )}
                            </div>

<<<<<<< HEAD
                            {/* Displaying main features */}
=======
>>>>>>> 5d1dd60 (Updated booked cars module)
                            {car.mainFeatures && car.mainFeatures.length > 0 && (
                              <div className="mt-4">
                                <h5 className="font-semibold text-gray-800 mb-2">Key Features</h5>
                                <ul className="list-none space-y-2">
                                  {car.mainFeatures.map((feature, index) => {
                                    const FeatureIcon = feature.icon
                                    return (
                                      <li key={index} className="flex items-center gap-2 text-gray-600 text-sm">
                                        <FeatureIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
                                        <span>{feature.name}</span>
                                      </li>
                                    )
                                  })}
                                </ul>
                              </div>
                            )}
                          </div>
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
    </div>
  )
}