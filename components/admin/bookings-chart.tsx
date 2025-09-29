"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", bookings: 85 },
  { month: "Feb", bookings: 92 },
  { month: "Mar", bookings: 78 },
  { month: "Apr", bookings: 95 },
  { month: "May", bookings: 88 },
  { month: "Jun", bookings: 105 },
  { month: "Jul", bookings: 98 },
  { month: "Aug", bookings: 110 },
  { month: "Sep", bookings: 102 },
  { month: "Oct", bookings: 115 },
  { month: "Nov", bookings: 108 },
  { month: "Dec", bookings: 120 },
]

export default function BookingsChart() {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-black">Bookings Trend</CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>This Year</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-2xl font-bold text-black">985</div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Bar dataKey="bookings" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
