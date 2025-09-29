"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  subtitle: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
  color: "red" | "blue" | "green" | "yellow"
}

export default function KpiCard({ title, subtitle, change, trend, icon: Icon, color }: KpiCardProps) {
  const colorClasses = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{subtitle}</CardTitle>
        <div className={`w-10 h-10 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-black">{title}</div>
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
          {trend === "up" ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={trend === "up" ? "text-green-500" : "text-red-500"}>{change}</span>
          <span>from last month</span>
        </div>
      </CardContent>
    </Card>
  )
}
