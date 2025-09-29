"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Car, User, AlertTriangle, CheckCircle } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "booking",
    title: "New Car Booking",
    message: "John Doe booked BMW 3 Series for 3 days",
    time: "2 minutes ago",
    priority: "high",
    read: false,
  },
  {
    id: 2,
    type: "maintenance",
    title: "Maintenance Due",
    message: "Audi Q5 requires scheduled maintenance",
    time: "1 hour ago",
    priority: "medium",
    read: false,
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Received",
    message: "₹25,000 payment received from Jane Smith",
    time: "3 hours ago",
    priority: "low",
    read: true,
  },
  {
    id: 4,
    type: "overdue",
    title: "Rental Overdue",
    message: "Mercedes C-Class rental is 2 days overdue",
    time: "5 hours ago",
    priority: "high",
    read: false,
  },
  {
    id: 5,
    type: "staff",
    title: "New Staff Member",
    message: "Sarah Wilson joined as Sales Executive",
    time: "1 day ago",
    priority: "low",
    read: true,
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "booking":
      return <Car className="h-4 w-4 text-blue-500" />
    case "maintenance":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case "payment":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "overdue":
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    case "staff":
      return <User className="h-4 w-4 text-purple-500" />
    default:
      return <Bell className="h-4 w-4 text-gray-500" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function NotificationsWidget() {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-black flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Recent Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                notification.read ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="mt-1">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-black text-sm">{notification.title}</p>
                  <Badge className={`${getPriorityColor(notification.priority)} border text-xs`}>
                    {notification.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
              {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
