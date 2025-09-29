"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ref, onValue } from "firebase/database"
import { realtimeDb } from "@/firebase/config"
import { Calendar, User, Car, CreditCard, MapPin, Eye } from "lucide-react"

interface BookingData {
  id: string
  carName: string
  carImage: string
  carModel: string
  carYear: string
  ownerName: string
  bookingDate: string
  pickupLocation: string
  preferredVariant: string
  paymentPreference: string
  status: string
  createdAt: string
}

export default function RealtimeSalesView() {
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)

  useEffect(() => {
    const bookingsRef = ref(realtimeDb, "BookingCar")

    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const bookingsList: BookingData[] = []

        Object.keys(data).forEach((userId) => {
          Object.keys(data[userId]).forEach((bookingId) => {
            bookingsList.push({
              id: bookingId,
              ...data[userId][bookingId],
            })
          })
        })

        // Sort by creation date (newest first)
        bookingsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setBookings(bookingsList)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentColor = (payment: string) => {
    switch (payment.toLowerCase()) {
      case "cash":
        return "bg-green-100 text-green-800"
      case "finance":
        return "bg-blue-100 text-blue-800"
      case "lease":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-black">{bookings.length}</p>
              </div>
              <Car className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter((b) => b.status === "Confirmed").length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cash Payments</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter((b) => b.paymentPreference === "cash").length}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Finance/Lease</p>
                <p className="text-2xl font-bold text-blue-600">
                  {bookings.filter((b) => b.paymentPreference === "finance" || b.paymentPreference === "lease").length}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-black">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-black">{booking.carName}</h3>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      <Badge className={getPaymentColor(booking.paymentPreference)}>{booking.paymentPreference}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{booking.ownerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.pickupLocation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        <span>{booking.preferredVariant}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      Booked on: {new Date(booking.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)} className="ml-4">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-black">Booking Details</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(null)}>
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Car Information */}
              <div>
                <h4 className="font-semibold text-black mb-3">Car Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Car Name:</span>
                    <p className="font-medium text-black">{selectedBooking.carName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Model Year:</span>
                    <p className="font-medium text-black">{selectedBooking.carYear}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Variant:</span>
                    <p className="font-medium text-black">{selectedBooking.preferredVariant}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <Badge className={getStatusColor(selectedBooking.status)}>{selectedBooking.status}</Badge>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h4 className="font-semibold text-black mb-3">Customer Information</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-black">{selectedBooking.ownerName}</span>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div>
                <h4 className="font-semibold text-black mb-3">Booking Information</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Booking Date:</span>
                    <span className="font-medium text-black">
                      {new Date(selectedBooking.bookingDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Pickup Location:</span>
                    <span className="font-medium text-black">{selectedBooking.pickupLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Payment Method:</span>
                    <Badge className={getPaymentColor(selectedBooking.paymentPreference)}>
                      {selectedBooking.paymentPreference}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium text-black">
                      {new Date(selectedBooking.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
