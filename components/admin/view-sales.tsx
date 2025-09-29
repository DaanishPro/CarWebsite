"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BarChart3, Search, DollarSign, TrendingUp, Users, Calendar } from "lucide-react"
import { ref, onValue } from "firebase/database"
import { realtimeDb } from "@/firebase/config"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

interface SalesData {
  id: string
  carName: string
  customerName: string
  bookingDate: string
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  paymentStatus: "pending" | "partial" | "completed"
  paymentMethod: string
  createdAt: string
}

export default function ViewSales() {
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    fetchSalesData()
  }, [])

  const fetchSalesData = async () => {
    try {
      // Listen to bookings in real-time
      const bookingsRef = ref(realtimeDb, "BookingCar")

      const unsubscribe = onValue(bookingsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          const salesList: SalesData[] = []

          // Flatten the nested structure and create sales data
          Object.keys(data).forEach((userId) => {
            Object.keys(data[userId]).forEach((bookingId) => {
              const booking = data[userId][bookingId]

              // Calculate amounts (mock data for demonstration)
              const totalAmount = Math.floor(Math.random() * 500000) + 100000
              const paidAmount = Math.floor(totalAmount * (Math.random() * 0.8 + 0.2))
              const remainingAmount = totalAmount - paidAmount

              let paymentStatus: "pending" | "partial" | "completed" = "pending"
              if (paidAmount === totalAmount) {
                paymentStatus = "completed"
              } else if (paidAmount > 0) {
                paymentStatus = "partial"
              }

              salesList.push({
                id: bookingId,
                carName: booking.carName || booking.carModel,
                customerName: booking.ownerName || booking.fullName,
                bookingDate: booking.bookingDate,
                totalAmount,
                paidAmount,
                remainingAmount,
                paymentStatus,
                paymentMethod: booking.paymentPreference || "cash",
                createdAt: booking.createdAt,
              })
            })
          })

          setSalesData(salesList)
        }
        setLoading(false)
      })

      return () => unsubscribe()
    } catch (error) {
      console.error("Error fetching sales data:", error)
      setLoading(false)
    }
  }

  const filteredSales = salesData.filter((sale) => {
    const matchesSearch =
      sale.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || sale.paymentStatus === filterStatus

    return matchesSearch && matchesFilter
  })

  const getSalesStats = () => {
    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.paidAmount, 0)
    const totalPending = salesData.reduce((sum, sale) => sum + sale.remainingAmount, 0)
    const completedSales = salesData.filter((sale) => sale.paymentStatus === "completed").length
    const avgSaleValue = salesData.length > 0 ? totalRevenue / salesData.length : 0

    return {
      totalRevenue,
      totalPending,
      completedSales,
      avgSaleValue,
      totalSales: salesData.length,
    }
  }

  const getPaymentStatusData = () => {
    const statusCounts = salesData.reduce(
      (acc, sale) => {
        acc[sale.paymentStatus] = (acc[sale.paymentStatus] || 0) + 1
        return acc
      },
      {} as { [key: string]: number },
    )

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: getStatusColor(status),
    }))
  }

  const getMonthlyRevenue = () => {
    const monthlyData = salesData.reduce(
      (acc, sale) => {
        const month = new Date(sale.createdAt).toLocaleDateString("en-US", { month: "short" })
        acc[month] = (acc[month] || 0) + sale.paidAmount
        return acc
      },
      {} as { [key: string]: number },
    )

    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue: revenue / 100000, // Convert to lakhs
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#22C55E"
      case "partial":
        return "#EAB308"
      case "pending":
        return "#EF4444"
      default:
        return "#6B7280"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "partial":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "pending":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const stats = getSalesStats()
  const paymentStatusData = getPaymentStatusData()
  const monthlyRevenue = getMonthlyRevenue()

  if (loading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sales Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-black">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-black">₹{(stats.totalPending / 100000).toFixed(1)}L</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Sales</p>
                <p className="text-2xl font-bold text-black">{stats.completedSales}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-black">{stats.totalSales}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black">Monthly Revenue (₹ Lakhs)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Bar dataKey="revenue" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Status Distribution */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black">Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentStatusData.map((entry, index) => (
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

      {/* Sales Table */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-black flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sales Details ({filteredSales.length} records)
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="partial">Partial</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Car & Customer</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Booking Date</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Total Amount</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Paid Amount</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Remaining</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium text-black">{sale.carName}</p>
                        <p className="text-sm text-gray-600">{sale.customerName}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-gray-700">{sale.bookingDate}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-medium text-black">₹{(sale.totalAmount / 100000).toFixed(1)}L</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-medium text-green-600">₹{(sale.paidAmount / 100000).toFixed(1)}L</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-medium text-red-600">₹{(sale.remainingAmount / 100000).toFixed(1)}L</span>
                    </td>
                    <td className="py-3 px-2">
                      <Badge className={`${getStatusBadgeColor(sale.paymentStatus)} border`}>
                        {sale.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-gray-700 capitalize">{sale.paymentMethod}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
