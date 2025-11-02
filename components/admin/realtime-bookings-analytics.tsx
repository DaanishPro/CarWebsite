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
  amount?: number
}

export default function RealtimeBookingsAnalytics() {
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)

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

        setBookings(bookingsList)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const processBookingsData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    return last7Days.map((date) => {
      const dayBookings = bookings.filter((booking) => booking.createdAt?.split("T")[0] === date)
      const totalRevenue = dayBookings.reduce((sum, b) => sum + (b.amount || 0), 0)

      return {
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        bookings: dayBookings.length,
        revenue: totalRevenue,
      }
    })
  }

  const getBookingStats = () => {
    const today = new Date().toISOString().split("T")[0]
    const thisWeek = new Date()
    thisWeek.setDate(thisWeek.getDate() - 7)

    const todayBookings = bookings.filter((booking) => booking.createdAt?.split("T")[0] === today).length
    const weekBookings = bookings.filter((booking) => new Date(booking.createdAt) >= thisWeek).length
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0)
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
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Booking Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Today's Bookings", value: stats.todayBookings, icon: <Calendar className="h-8 w-8 text-red-500" /> },
          { label: "This Week", value: stats.weekBookings, icon: <TrendingUp className="h-8 w-8 text-red-500" /> },
          { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign className="h-8 w-8 text-red-500" /> },
          { label: "Total Bookings", value: stats.totalBookings, icon: <Users className="h-8 w-8 text-red-500" /> },
        ].map((item, index) => (
          <Card
            key={index}
            className="bg-gradient-to-br from-white via-red-50 to-white border border-red-100 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl"
          >
            <CardContent className="p-5 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">{item.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Trends Chart */}
      <Card className="bg-white border border-red-100 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-gray-900">Booking Trends (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Area type="monotone" dataKey="bookings" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Bookings" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <Card className="bg-white border border-red-100 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentStats.map((payment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-800">{payment.method}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-900 font-semibold">{payment.count}</span>
                    <span className="text-gray-600 text-sm ml-2">({payment.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="bg-white border border-red-100 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-72 overflow-y-auto">
              {bookings.slice(0, 5).map((booking, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-xl hover:bg-red-100 transition">
                  <div>
                    <p className="font-semibold text-gray-900">{booking.carName}</p>
                    <p className="text-sm text-gray-600">{booking.ownerName}</p>
                    <p className="text-xs text-gray-500">{booking.paymentPreference}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-800 font-semibold">₹{booking.amount?.toLocaleString() || "0"}</p>
                    <p className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</p>
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
