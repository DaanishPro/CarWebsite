"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, MapPin, User2, Mail, Phone, CarFront } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/context/AuthContext"
import { toast } from "react-hot-toast"
import { ref, set } from "firebase/database"
import { realtimeDb } from "@/firebase/config"

interface CarData {
  id: string
  name: string
  imageSrc: string
  price: number
  discount?: number
  year: number
  mainFeatures: { name: string; icon: React.ElementType }[]
}

interface BookCarFormProps {
  isOpen: boolean
  onClose: () => void
  carData: CarData | null
}

const CarVariants: { [key: string]: string[] } = {
  "Ferrari 488 GTB": ["Red", "Black", "Yellow"],
  "Honda City": ["Blue", "White", "Grey"],
  "Mahindra XUV700": ["Black", "White", "Red"],
  "Tata Nexon EV": ["White", "Blue", "Black"],
  "Maruti Suzuki Swift": ["Silver", "Red", "Blue"],
  "Ford Mustang (1967)": ["Yellow", "Black", "Red"],
  "BMW 3 Series": ["White", "Black", "Silver"],
  "Hyundai i20": ["Red", "Black", "White"],
  "Audi Q5": ["White", "Black", "Grey"],
  "Mercedes-Benz C-Class": ["Black", "White", "Silver"],
  "Jeep Compass": ["Grey", "Black", "Red"],
  "Kia Seltos": ["Orange", "White", "Black"],
  "MG Hector": ["Red", "White", "Black"],
  "Nissan Magnite": ["Silver", "Red", "Blue"],
  "Porsche 911": ["Yellow", "Red", "Black"],
  "Renault Kwid": ["Blue", "White", "Red"],
  "Rolls-Royce Phantom": ["Black", "White", "Blue"],
  "Skoda Slavia": ["Red", "White", "Silver"],
  "Toyota Innova Crysta": ["White", "Silver", "Grey"],
  "Volkswagen Virtus": ["Yellow", "Red", "White"],
}

export default function BookCarForm({ isOpen, onClose, carData }: BookCarFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    carModel: "",
    preferredVariant: "",
    bookingDate: "",
    city: "",
    paymentPreference: "",
    agreedToTerms: false,
    sendUpdates: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (carData) {
      setFormData((prev) => ({
        ...prev,
        carModel: carData.name,
      }))
    }
  }, [carData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ✅ Save booking with price and discount
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!user) {
      toast.error("You must be signed in to book a car.")
      setIsSubmitting(false)
      return
    }

    if (!carData || !carData.id) {
      toast.error("Car data is missing. Please close and try again.")
      setIsSubmitting(false)
      return
    }

    if (
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.emailAddress ||
      !formData.preferredVariant ||
      !formData.bookingDate ||
      !formData.city ||
      !formData.paymentPreference ||
      !formData.agreedToTerms
    ) {
      toast.error("Please fill in all required fields and agree to the terms.")
      setIsSubmitting(false)
      return
    }

    const bookingId = `${carData.id}_${Date.now()}`
    const bookingRecord = {
      bookingId,
      carName: carData.name,
      carImage: carData.imageSrc,
      carModel: carData.name,
      carYear: String(carData.year),
      ownerName: formData.fullName,
      bookingDate: formData.bookingDate,
      pickupLocation: formData.city,
      preferredVariant: formData.preferredVariant,
      paymentPreference: formData.paymentPreference,
      price: carData.price, // ✅ Added car price
      discount: carData.discount || 0, // ✅ Added discount (if any)
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    }

    try {
      const bookingRef = ref(realtimeDb, `BookingCar/${user.uid}/${bookingId}`)
      await set(bookingRef, bookingRecord)
      toast.success(`Successfully booked the ${carData.name}!`)
      setIsSubmitting(false)
      onClose()
    } catch (error) {
      console.error("Error saving booking:", error)
      toast.error("There was an error booking the car. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !carData) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg rounded-3xl shadow-2xl relative bg-white dark:bg-gray-900 border border-theme-primary-200/50"
        >
          <Card className="rounded-3xl border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-2xl font-bold font-display text-theme-accent-900">
                  Book Your {carData.name}
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-theme-accent-600">
                  Please fill out the form below to book your test drive or viewing.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full text-theme-accent-500 hover:bg-theme-accent-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="grid gap-4 py-4">
                {/* Full Name & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-accent-400" />
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="pl-10 h-11 bg-theme-accent-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-accent-400" />
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="pl-10 h-11 bg-theme-accent-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-accent-400" />
                    <Input
                      id="emailAddress"
                      name="emailAddress"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.emailAddress}
                      onChange={handleChange}
                      className="pl-10 h-11 bg-theme-accent-50"
                    />
                  </div>
                </div>

                {/* Car Model & Variant */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="carModel">Car Model</Label>
                    <div className="relative">
                      <CarFront className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-accent-400" />
                      <Input
                        id="carModel"
                        name="carModel"
                        value={formData.carModel}
                        readOnly
                        className="pl-10 h-11 bg-theme-accent-100 cursor-not-allowed text-theme-accent-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredVariant">Preferred Variant / Color</Label>
                    <Select
                      name="preferredVariant"
                      onValueChange={(value) => handleSelectChange("preferredVariant", value)}
                    >
                      <SelectTrigger className="w-full h-11 bg-theme-accent-50">
                        <SelectValue placeholder="Select a variant" />
                      </SelectTrigger>
                      <SelectContent>
                        {CarVariants[carData.name]?.map((variant) => (
                          <SelectItem key={variant} value={variant}>
                            {variant}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Booking Date & City */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bookingDate">Booking Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-accent-400" />
                      <Input
                        id="bookingDate"
                        name="bookingDate"
                        type="date"
                        value={formData.bookingDate}
                        onChange={handleChange}
                        className="pl-10 h-11 bg-theme-accent-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City / Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-accent-400" />
                      <Input
                        id="city"
                        name="city"
                        placeholder="Mumbai"
                        value={formData.city}
                        onChange={handleChange}
                        className="pl-10 h-11 bg-theme-accent-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Preference */}
                <div className="space-y-2">
                  <Label htmlFor="paymentPreference">Payment Preference</Label>
                  <Select
                    name="paymentPreference"
                    onValueChange={(value) => handleSelectChange("paymentPreference", value)}
                  >
                    <SelectTrigger className="w-full h-11 bg-theme-accent-50">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="finance">Finance/Loan</SelectItem>
                      <SelectItem value="lease">Lease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Terms & Updates */}
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      name="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, agreedToTerms: !!checked }))
                      }
                    />
                    <Label htmlFor="terms" className="text-sm text-theme-accent-700">
                      I agree to the <span className="font-semibold text-theme-primary-600">terms & conditions</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="updates"
                      name="sendUpdates"
                      checked={formData.sendUpdates}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, sendUpdates: !!checked }))
                      }
                    />
                    <Label htmlFor="updates" className="text-sm text-theme-accent-700">
                      Send me updates & offers
                    </Label>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Book Now"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
