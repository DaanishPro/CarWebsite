"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts"
import { ref, onValue } from "firebase/database"
import { realtimeDb } from "@/firebase/config"
import { Calendar, TrendingUp, DollarSign, Users } from "lucide-react"

interface BookingData {
  id: string
  carName: string
  ownerName: string
  bookingDate: string
  status: string
  createdAt: string
  paymentPreference: string
}

export default function RealtimeBookingsAnalytics() {
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to bookings in real-time
    const bookingsRef = ref(realtimeDb, "BookingCar")

    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const bookingsList: BookingData[] = []

        // Flatten the nested structure (userId -> bookingId -> data)
        Object.keys(data).forEach((userId) => {
          Object.keys(data[userId]).forEach((bookingId) => {
            bookingsList.push({
              id: bookingId,
              ...data[userId][bookingId],
            })
          })
        })

        setBookings(bookingsList)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Process data for charts
  const processBookingsData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    const dailyBookings = last7Days.map((date) => {
      const dayBookings = bookings.filter((booking) => booking.createdAt?.split("T")[0] === date)

      return {
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        bookings: dayBookings.length,
        revenue: dayBookings.length * 25000, // Estimated average booking value
      }
    })

    return dailyBookings
  }

  const getBookingStats = () => {
    const today = new Date().toISOString().split("T")[0]
    const thisWeek = new Date()
    thisWeek.setDate(thisWeek.getDate() - 7)

    const todayBookings = bookings.filter((booking) => booking.createdAt?.split("T")[0] === today).length

    const weekBookings = bookings.filter((booking) => new Date(booking.createdAt) >= thisWeek).length

    const totalRevenue = bookings.length * 25000 // Estimated
    const avgBookingValue = bookings.length > 0 ? totalRevenue / bookings.length : 0

    return {
      todayBookings,
      weekBookings,
      totalRevenue,
      avgBookingValue,
      totalBookings: bookings.length,
    }
  }

  const getPaymentMethodStats = () => {
    const paymentMethods = bookings.reduce(
      (acc, booking) => {
        const method = booking.paymentPreference || "cash"
        acc[method] = (acc[method] || 0) + 1
        return acc
      },
      {} as { [key: string]: number },
    )

    return Object.entries(paymentMethods).map(([method, count]) => ({
      method: method.charAt(0).toUpperCase() + method.slice(1),
      count,
      percentage: ((count / bookings.length) * 100).toFixed(1),
    }))
  }

  const chartData = processBookingsData()
  const stats = getBookingStats()
  const paymentStats = getPaymentMethodStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Booking Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Bookings</p>
                <p className="text-2xl font-bold text-black">{stats.todayBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-black">{stats.weekBookings}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-black">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-black">{stats.totalBookings}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Trends Chart */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-black">Booking Trends (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.3}
                  name="Bookings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentStats.map((payment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-black">{payment.method}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-black font-medium">{payment.count}</span>
                    <span className="text-gray-600 text-sm ml-2">({payment.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {bookings.slice(0, 5).map((booking, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-black">{booking.carName}</p>
                    <p className="text-sm text-gray-600">{booking.ownerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{new Date(booking.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">{booking.paymentPreference}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
