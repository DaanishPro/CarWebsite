"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "Rented", value: 58, color: "#1F2937" },
  { name: "Pending", value: 24, color: "#EF4444" },
  { name: "Cancelled", value: 18, color: "#6B7280" },
]

export default function RentStatusWidget() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Rent Status</CardTitle>
        <p className="text-sm text-gray-400">This Week</p>
      </CardHeader>
      <CardContent>
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-300">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-white">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
