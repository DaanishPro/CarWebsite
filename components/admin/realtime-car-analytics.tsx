"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts"
import { ref, onValue } from "firebase/database"
import { realtimeDb } from "@/firebase/config"
import { Eye, Heart, Share2, Phone } from "lucide-react"

// Car data from feature sections
const carData = [
  {
    id: "ferrari-488-gtb",
    name: "Ferrari 488 GTB",
    price: 36000000,
    category: "Sports",
    location: "Mumbai",
    views: 0,
    likes: 0,
    shares: 0,
    contacts: 0,
  },
  {
    id: "honda-city",
    name: "Honda City",
    price: 1200000,
    category: "Sedan",
    location: "Delhi",
    views: 0,
    likes: 0,
    shares: 0,
    contacts: 0,
  },
  {
    id: "mahindra-xuv700",
    name: "Mahindra XUV700",
    price: 2000000,
    category: "SUV",
    location: "Bangalore",
    views: 0,
    likes: 0,
    shares: 0,
    contacts: 0,
  },
  {
    id: "tata-nexon-ev",
    name: "Tata Nexon EV",
    price: 1500000,
    category: "Electric",
    location: "Pune",
    views: 0,
    likes: 0,
    shares: 0,
    contacts: 0,
  },
  {
    id: "maruti-suzuki-swift",
    name: "Maruti Suzuki Swift",
    price: 800000,
    category: "Hatchback",
    location: "Chennai",
    views: 0,
    likes: 0,
    shares: 0,
    contacts: 0,
  },
  {
    id: "ford-mustang-1976",
    name: "Ford Mustang (1967)",
    price: 7500000,
    category: "Classic",
    location: "Mumbai",
    views: 0,
    likes: 0,
    shares: 0,
    contacts: 0,
  },
]

export default function RealtimeCarAnalytics() {
  const [interactions, setInteractions] = useState<any[]>([])
  const [carStats, setCarStats] = useState(carData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to feature interactions in real-time
    const interactionsRef = ref(realtimeDb, "featureInteractions")

    const unsubscribe = onValue(interactionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const interactionsList = Object.values(data) as any[]
        setInteractions(interactionsList)

        // Calculate stats for each car
        const updatedStats = carData.map((car) => {
          const carInteractions = interactionsList.filter((interaction) => interaction.featureId === car.id)

          return {
            ...car,
            views: carInteractions.filter((i) => i.action === "view").length,
            likes: carInteractions.filter((i) => i.action === "like").length,
            shares: carInteractions.filter((i) => i.action === "share").length,
            contacts: carInteractions.filter((i) => i.action === "contact").length,
          }
        })

        setCarStats(updatedStats)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Prepare chart data
  const popularityData = carStats.map((car) => ({
    name: car.name.split(" ").slice(0, 2).join(" "),
    views: car.views,
    contacts: car.contacts,
    totalInteractions: car.views + car.likes + car.shares + car.contacts,
  }))

  const categoryData = carStats.reduce((acc, car) => {
    const existing = acc.find((item) => item.category === car.category)
    if (existing) {
      existing.count += 1
      existing.totalViews += car.views
    } else {
      acc.push({
        category: car.category,
        count: 1,
        totalViews: car.views,
        color: getCategoryColor(car.category),
      })
    }
    return acc
  }, [] as any[])

  const priceRangeData = [
    { range: "Under ₹10L", count: carStats.filter((car) => car.price < 1000000).length },
    { range: "₹10L - ₹20L", count: carStats.filter((car) => car.price >= 1000000 && car.price < 2000000).length },
    { range: "₹20L - ₹50L", count: carStats.filter((car) => car.price >= 2000000 && car.price < 5000000).length },
    { range: "Above ₹50L", count: carStats.filter((car) => car.price >= 5000000).length },
  ]

  const topPerformingCars = [...carStats].sort((a, b) => b.views + b.contacts - (a.views + a.contacts)).slice(0, 5)

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-black">{carStats.reduce((sum, car) => sum + car.views, 0)}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-black">{carStats.reduce((sum, car) => sum + car.contacts, 0)}</p>
              </div>
              <Phone className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-black">{carStats.reduce((sum, car) => sum + car.likes, 0)}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Shares</p>
                <p className="text-2xl font-bold text-black">{carStats.reduce((sum, car) => sum + car.shares, 0)}</p>
              </div>
              <Share2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Car Popularity Chart */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black">Car Popularity (Views vs Contacts)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Bar dataKey="views" fill="#3B82F6" name="Views" />
                  <Bar dataKey="contacts" fill="#EF4444" name="Contacts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black">Car Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {categoryData.map((entry, index) => (
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

      {/* Price Range Analysis */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-black">Price Range Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceRangeData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" fontSize={12} />
                <YAxis dataKey="range" type="category" stroke="#6B7280" fontSize={12} />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Cars */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-black">Top Performing Cars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformingCars.map((car, index) => (
              <div key={car.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
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
                    <span>{car.views} views</span>
                    <span>{car.contacts} contacts</span>
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

function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    Sports: "#EF4444",
    Sedan: "#F97316",
    SUV: "#EAB308",
    Electric: "#22C55E",
    Hatchback: "#3B82F6",
    Classic: "#8B5CF6",
  }
  return colors[category] || "#6B7280"
}
