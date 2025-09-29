"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { ref, onValue } from "firebase/database"
import { realtimeDb } from "@/firebase/config"
import { Car, DollarSign, TrendingUp, Eye, Phone, Calendar, ShoppingCart } from "lucide-react"

// Import car data from feature section
const allCars = [
  {
    id: "1",
    name: "Ferrari 488 GTB",
    price: 36000000,
    discount: 1000000,
    category: "Sports",
    location: "Mumbai",
    year: 2022,
    fuelType: "Petrol",
  },
  {
    id: "2",
    name: "Honda City",
    price: 1200000,
    discount: 50000,
    category: "Sedan",
    location: "Delhi",
    year: 2023,
    fuelType: "Petrol",
  },
  {
    id: "3",
    name: "Mahindra XUV700",
    price: 2000000,
    discount: 75000,
    category: "SUV",
    location: "Bangalore",
    year: 2023,
    fuelType: "Petrol/Diesel",
  },
  {
    id: "4",
    name: "Tata Nexon EV",
    price: 1500000,
    discount: 0,
    category: "Electric",
    location: "Pune",
    year: 2023,
    fuelType: "Electric",
  },
  {
    id: "5",
    name: "Maruti Suzuki Swift",
    price: 800000,
    discount: 20000,
    category: "Hatchback",
    location: "Chennai",
    year: 2023,
    fuelType: "Petrol",
  },
  // Add more cars as needed...
]

interface BookingData {
  id: string
  carName: string
  carImage: string
  ownerName: string
  bookingDate: string
  paymentPreference: string
  status: string
  createdAt: string
}

interface CarInteraction {
  userId: string
  featureId: string
  action: string
  timestamp: string
}

export default function EnhancedRealtimeDashboard() {
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [interactions, setInteractions] = useState<CarInteraction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bookingsRef = ref(realtimeDb, "BookingCar")
    const interactionsRef = ref(realtimeDb, "featureInteractions")

    const unsubscribeBookings = onValue(bookingsRef, (snapshot) => {
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
    })

    const unsubscribeInteractions = onValue(interactionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const interactionsList = Object.values(data) as CarInteraction[]
        setInteractions(interactionsList)
      }
      setLoading(false)
    })

    return () => {
      unsubscribeBookings()
      unsubscribeInteractions()
    }
  }, [])

  const getDashboardMetrics = () => {
    const today = new Date().toISOString().split("T")[0]
    const thisWeek = new Date()
    thisWeek.setDate(thisWeek.getDate() - 7)

    const todayBookings = bookings.filter((booking) => booking.createdAt?.split("T")[0] === today).length
    const weekBookings = bookings.filter((booking) => new Date(booking.createdAt) >= thisWeek).length
    const totalRevenue = bookings.reduce((sum, booking) => {
      const car = allCars.find((c) => c.name === booking.carName)
      return sum + (car ? car.price - (car.discount || 0) : 0)
    }, 0)

    const totalViews = interactions.filter((i) => i.action === "view").length
    const totalContacts = interactions.filter((i) => i.action === "contact").length

    return {
      totalCars: allCars.length,
      totalBookings: bookings.length,
      todayBookings,
      weekBookings,
      totalRevenue,
      totalViews,
      totalContacts,
      conversionRate: totalViews > 0 ? ((totalContacts / totalViews) * 100).toFixed(1) : "0",
    }
  }

  const getBookingTrends = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    return last7Days.map((date) => {
      const dayBookings = bookings.filter((booking) => booking.createdAt?.split("T")[0] === date)
      const dayRevenue = dayBookings.reduce((sum, booking) => {
        const car = allCars.find((c) => c.name === booking.carName)
        return sum + (car ? car.price - (car.discount || 0) : 0)
      }, 0)

      return {
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        bookings: dayBookings.length,
        revenue: dayRevenue / 100000, // Convert to lakhs
      }
    })
  }

  const getPopularCars = () => {
    return allCars
      .map((car) => {
        const carInteractions = interactions.filter((i) => i.featureId === car.id)
        const carBookings = bookings.filter((b) => b.carName === car.name)

        return {
          ...car,
          views: carInteractions.filter((i) => i.action === "view").length,
          contacts: carInteractions.filter((i) => i.action === "contact").length,
          bookings: carBookings.length,
          totalInteractions: carInteractions.length,
        }
      })
      .sort((a, b) => b.totalInteractions - a.totalInteractions)
      .slice(0, 5)
  }

  const getPaymentDistribution = () => {
    const paymentMethods = bookings.reduce(
      (acc, booking) => {
        const method = booking.paymentPreference || "cash"
        acc[method] = (acc[method] || 0) + 1
        return acc
      },
      {} as { [key: string]: number },
    )

    return Object.entries(paymentMethods).map(([method, count]) => ({
      name: method.charAt(0).toUpperCase() + method.slice(1),
      value: count,
      color: getPaymentColor(method),
    }))
  }

  const getCategoryPerformance = () => {
    const categories = allCars.reduce(
      (acc, car) => {
        const carBookings = bookings.filter((b) => b.carName === car.name).length
        const carViews = interactions.filter((i) => i.featureId === car.id && i.action === "view").length

        if (!acc[car.category]) {
          acc[car.category] = { bookings: 0, views: 0, cars: 0 }
        }

        acc[car.category].bookings += carBookings
        acc[car.category].views += carViews
        acc[car.category].cars += 1

        return acc
      },
      {} as { [key: string]: { bookings: number; views: number; cars: number } },
    )

    return Object.entries(categories).map(([category, data]) => ({
      category,
      bookings: data.bookings,
      views: data.views,
      cars: data.cars,
      avgBookingsPerCar: (data.bookings / data.cars).toFixed(1),
    }))
  }

  const metrics = getDashboardMetrics()
  const trendData = getBookingTrends()
  const popularCars = getPopularCars()
  const paymentData = getPaymentDistribution()
  const categoryData = getCategoryPerformance()

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cars</p>
                <p className="text-2xl font-bold text-black">{metrics.totalCars}</p>
                <p className="text-xs text-green-600">Available inventory</p>
              </div>
              <Car className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-black">{metrics.totalBookings}</p>
                <p className="text-xs text-green-600">+{metrics.todayBookings} today</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-black">₹{(metrics.totalRevenue / 10000000).toFixed(1)}Cr</p>
                <p className="text-xs text-green-600">From bookings</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-black">{metrics.conversionRate}%</p>
                <p className="text-xs text-gray-600">
                  {metrics.totalContacts}/{metrics.totalViews} contacts
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black">Booking Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
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

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black">Revenue Trends (₹ Lakhs)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black">Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="category" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Bar dataKey="bookings" fill="#3B82F6" name="Bookings" />
                  <Bar dataKey="views" fill="#EF4444" name="Views" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-black">Top Performing Cars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularCars.map((car, index) => (
              <div key={car.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-black">{car.name}</p>
                    <p className="text-sm text-gray-600">
                      {car.category} • {car.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-black">₹{(car.price / 100000).toFixed(1)}L</p>
                  <div className="flex gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {car.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {car.contacts}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {car.bookings}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getPaymentColor(method: string): string {
  const colors: { [key: string]: string } = {
    cash: "#10B981",
    finance: "#3B82F6",
    lease: "#F59E0B",
  }
  return colors[method] || "#6B7280"
}
