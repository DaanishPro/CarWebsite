"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { onValue, ref } from "firebase/database"
import { realtimeDb } from "@/firebase/config"

interface Booking {
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-800 border-green-200"
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const bookingsRef = ref(realtimeDb, "BookingCar")
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const allBookings: Booking[] = []

        // Extract nested user bookings
        Object.keys(data).forEach((userId) => {
          Object.keys(data[userId]).forEach((carId) => {
            allBookings.push({
              id: `${userId}-${carId}`,
              ...data[userId][carId],
            })
          })
        })

        // ✅ Sort by createdAt descending (latest bookings first)
        const sortedBookings = allBookings.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.bookingDate).getTime()
          const dateB = new Date(b.createdAt || b.bookingDate).getTime()
          return dateB - dateA // latest first
        })

        setBookings(sortedBookings)
      } else {
        setBookings([])
      }
    })

    return () => unsubscribe()
  }, [])

  const filteredBookings = bookings.filter((booking) =>
    booking.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-black font-semibold">Booked Cars (Realtime)</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, car, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Car Name</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Booking Date</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Location</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Variant</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Payment</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={booking.carImage}
                        alt={booking.carName}
                        className="w-10 h-10 rounded-md object-cover border border-gray-200"
                      />
                      <div>
                        <span className="text-sm font-medium text-black">{booking.carName}</span>
                        <div className="text-xs text-gray-500">{booking.carModel}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-black">{booking.ownerName}</td>
                  <td className="py-3 px-2 text-sm text-gray-700">{booking.bookingDate}</td>
                  <td className="py-3 px-2 text-sm text-gray-700">{booking.pickupLocation}</td>
                  <td className="py-3 px-2 text-sm text-gray-700">{booking.preferredVariant}</td>
                  <td className="py-3 px-2 text-sm text-gray-700 capitalize">{booking.paymentPreference}</td>
                  <td className="py-3 px-2">
                    <Badge className={`${getStatusColor(booking.status)} border`}>
                      {booking.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
