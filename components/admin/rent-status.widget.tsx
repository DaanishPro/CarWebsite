"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Clock, CheckCircle, AlertCircle } from "lucide-react"

const rentals = [
  {
    id: "R001",
    car: "BMW 3 Series",
    customer: "John Doe",
    status: "Active",
    endDate: "2024-01-15",
    amount: "₹25,000",
  },
  {
    id: "R002",
    car: "Audi Q5",
    customer: "Jane Smith",
    status: "Pending",
    endDate: "2024-01-12",
    amount: "₹35,000",
  },
  {
    id: "R003",
    car: "Mercedes C-Class",
    customer: "Mike Johnson",
    status: "Completed",
    endDate: "2024-01-10",
    amount: "₹40,000",
  },
  {
    id: "R004",
    car: "Honda City",
    customer: "Sarah Wilson",
    status: "Overdue",
    endDate: "2024-01-08",
    amount: "₹15,000",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <Car className="h-4 w-4" />
    case "Pending":
      return <Clock className="h-4 w-4" />
    case "Completed":
      return <CheckCircle className="h-4 w-4" />
    case "Overdue":
      return <AlertCircle className="h-4 w-4" />
    default:
      return <Car className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "Overdue":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function RentStatusWidget() {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-black">Recent Rental Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rentals.map((rental) => (
            <div key={rental.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(rental.status)}
                  <div>
                    <p className="font-medium text-black">{rental.car}</p>
                    <p className="text-sm text-gray-600">{rental.customer}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className={`${getStatusColor(rental.status)} border mb-1`}>{rental.status}</Badge>
                <p className="text-sm text-gray-600">Due: {rental.endDate}</p>
                <p className="text-sm font-medium text-black">{rental.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
