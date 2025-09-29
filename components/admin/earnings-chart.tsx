"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", earnings: 45000 },
  { month: "Feb", earnings: 52000 },
  { month: "Mar", earnings: 48000 },
  { month: "Apr", earnings: 61000 },
  { month: "May", earnings: 55000 },
  { month: "Jun", earnings: 67000 },
  { month: "Jul", earnings: 59000 },
  { month: "Aug", earnings: 72000 },
  { month: "Sep", earnings: 68000 },
  { month: "Oct", earnings: 75000 },
  { month: "Nov", earnings: 71000 },
  { month: "Dec", earnings: 82000 },
]

export default function EarningsChart() {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-black">Earnings Overview</CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>This Year</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-2xl font-bold text-black">₹7,15,000</div>
          <div className="text-sm text-gray-600">Total Earnings</div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
