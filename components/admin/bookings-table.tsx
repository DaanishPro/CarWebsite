"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

const bookings = [
  {
    id: "BK-100003",
    date: "Aug 1, 2023",
    customer: "Alice Johnson",
    car: "Toyota Camry",
    variant: "Hybrid",
    days: "2 Days",
    startDate: "Aug 1, 2023",
    endDate: "Aug 3, 2023",
    amount: "$350",
    status: "Ongoing",
  },
  {
    id: "BK-100002",
    date: "Aug 1, 2023",
    customer: "Bob Smith",
    car: "Honda Civic",
    variant: "LX",
    days: "7 Days",
    startDate: "Aug 2, 2023",
    endDate: "Aug 9, 2023",
    amount: "$490",
    status: "Pending",
  },
  {
    id: "BK-100001",
    date: "Aug 2, 2023",
    customer: "Charlie Davis",
    car: "Ford Focus",
    variant: "SE",
    days: "3 Days",
    startDate: "Aug 3, 2023",
    endDate: "Aug 6, 2023",
    amount: "$420",
    status: "Ongoing",
  },
  {
    id: "BK-100004",
    date: "Aug 2, 2023",
    customer: "Diana White",
    car: "Nissan Altima",
    variant: "SV",
    days: "1 Day",
    startDate: "Aug 4, 2023",
    endDate: "Aug 5, 2023",
    amount: "$180",
    status: "Ongoing",
  },
  {
    id: "BK-100005",
    date: "Aug 2, 2023",
    customer: "Edward Green",
    car: "Chevrolet Malibu",
    variant: "LT",
    days: "5 Days",
    startDate: "Aug 5, 2023",
    endDate: "Aug 10, 2023",
    amount: "$650",
    status: "Ongoing",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Ongoing":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function BookingsTable() {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-black">Booked Cars Details</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, car, etc."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Car Name</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Buyer Name</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Booking Date</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Rental Period</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Booking Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <div>
                      <span className="text-sm font-medium text-black">{booking.car}</span>
                      <div className="text-xs text-gray-500">{booking.variant}</div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-black">{booking.customer}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-700">{booking.date}</span>
                  </td>
                  <td className="py-3 px-2">
                    <div>
                      <span className="text-sm text-gray-700">{booking.days}</span>
                      <div className="text-xs text-gray-500">
                        {booking.startDate} - {booking.endDate}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm font-medium text-black">{booking.amount}</span>
                  </td>
                  <td className="py-3 px-2">
                    <Badge className={`${getStatusColor(booking.status)} border`}>{booking.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
