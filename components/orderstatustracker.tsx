// components/OrderStatusTracker.tsx

"use client"

import { CheckCircle, Loader, Car, Star } from "lucide-react"

// Define the possible statuses for a booking
const statuses = [
  { name: "Confirmed", icon: CheckCircle },
  { name: "Processing", icon: Loader },
  { name: "Ready for Pickup", icon: Car },
  { name: "Completed", icon: Star },
]

interface OrderStatusTrackerProps {
  currentStatus: string
}

export default function OrderStatusTracker({ currentStatus }: OrderStatusTrackerProps) {
  // Find the index of the current status to determine progress
  const currentIndex = statuses.findIndex((s) => s.name.toLowerCase() === currentStatus.toLowerCase())

  return (
    <div className="border rounded-xl bg-gray-50/70 p-4 h-full">
      <h5 className="font-bold text-gray-800 mb-5 text-center text-md">Booking Status</h5>
      <ul className="space-y-6">
        {statuses.map((status, index) => {
          const isCompleted = currentIndex > -1 && index < currentIndex
          const isActive = index === currentIndex
          const isPending = currentIndex === -1 || index > currentIndex

          const Icon = status.icon

          return (
            <li key={status.name} className="flex items-center gap-4 relative">
              {/* Vertical line connecting the steps */}
              {index < statuses.length - 1 && (
                <div
                  className={`absolute left-4 top-10 h-full w-0.5 ${
                    isCompleted ? "bg-red-500" : "bg-gray-200"
                  }`}
                />
              )}

              <div
                className={`z-10 flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? "bg-red-500 text-white ring-4 ring-red-100"
                    : isActive
                    ? "bg-red-600 text-white ring-4 ring-red-200 animate-pulse"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={`font-medium transition-colors duration-300 ${
                  isCompleted
                    ? "text-gray-700"
                    : isActive
                    ? "text-red-700 font-bold"
                    : "text-gray-400"
                }`}
              >
                {status.name}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}