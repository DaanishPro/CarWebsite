"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Search, Filter, Eye, Trash2 } from "lucide-react"
import { ref, get, set, remove } from "firebase/database"
import { realtimeDb } from "@/firebase/config"
import { toast } from "react-hot-toast"

interface Car {
  id: string
  name: string
  price: number
  discount: number
  category: string
  fuelType: string
  transmission: string
  year: number
  location: string
  mileage: string
  description: string
  imageSrc: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export default function UpdateCar() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<Car>>({})

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const carsRef = ref(realtimeDb, "cars")
      const snapshot = await get(carsRef)

      if (snapshot.exists()) {
        const data = snapshot.val()
        const carsList = Object.entries(data).map(([id, car]: [string, any]) => ({
          id,
          ...car,
        }))
        setCars(carsList)
      }
    } catch (error) {
      console.error("Error fetching cars:", error)
      toast.error("Failed to fetch cars")
    } finally {
      setLoading(false)
    }
  }

  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditCar = (car: Car) => {
    setSelectedCar(car)
    setEditFormData(car)
    setIsEditing(true)
  }

  const handleUpdateCar = async () => {
    if (!selectedCar || !editFormData) return

    try {
      const carRef = ref(realtimeDb, `cars/${selectedCar.id}`)
      const updatedCar = {
        ...editFormData,
        updatedAt: new Date().toISOString(),
      }

      await set(carRef, updatedCar)

      toast.success("Car updated successfully!")
      setIsEditing(false)
      setSelectedCar(null)
      setEditFormData({})
      fetchCars()
    } catch (error) {
      console.error("Error updating car:", error)
      toast.error("Failed to update car")
    }
  }

  const handleDeleteCar = async (carId: string) => {
    if (!confirm("Are you sure you want to delete this car?")) {
      return
    }

    try {
      const carRef = ref(realtimeDb, `cars/${carId}`)
      await remove(carRef)

      toast.success("Car deleted successfully!")
      fetchCars()
    } catch (error) {
      console.error("Error deleting car:", error)
      toast.error("Failed to delete car")
    }
  }

  const toggleCarStatus = async (carId: string, currentStatus: string) => {
    try {
      const carRef = ref(realtimeDb, `cars/${carId}/status`)
      const newStatus = currentStatus === "active" ? "inactive" : "active"

      await set(carRef, newStatus)

      toast.success(`Car ${newStatus === "active" ? "activated" : "deactivated"} successfully!`)
      fetchCars()
    } catch (error) {
      console.error("Error updating car status:", error)
      toast.error("Failed to update car status")
    }
  }

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

  if (isEditing && selectedCar) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-black flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Car Details
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setSelectedCar(null)
                setEditFormData({})
              }}
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Car Name</label>
                <Input
                  value={editFormData.name || ""}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Input
                  value={editFormData.category || ""}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, category: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                <Input
                  type="number"
                  value={editFormData.price || ""}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, price: Number.parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Discount (₹)</label>
                <Input
                  type="number"
                  value={editFormData.discount || ""}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, discount: Number.parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Year</label>
                <Input
                  type="number"
                  value={editFormData.year || ""}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, year: Number.parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Fuel Type</label>
                <Input
                  value={editFormData.fuelType || ""}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, fuelType: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Transmission</label>
                <Input
                  value={editFormData.transmission || ""}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, transmission: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <Input
                  value={editFormData.location || ""}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mileage</label>
              <Input
                value={editFormData.mileage || ""}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, mileage: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg resize-none"
                rows={4}
                value={editFormData.description || ""}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleUpdateCar} className="bg-red-500 hover:bg-red-600 text-white">
                Update Car
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setSelectedCar(null)
                  setEditFormData({})
                }}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-black flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Update Car Details ({filteredCars.length} cars)
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
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
        {filteredCars.length === 0 ? (
          <div className="text-center py-8">
            <Edit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No cars found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Car Details</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Price</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Specifications</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((car) => (
                  <tr key={car.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={car.imageSrc || "/placeholder.svg"}
                          alt={car.name}
                          className="w-16 h-12 object-cover rounded-lg border border-gray-200"
                        />
                        <div>
                          <p className="font-medium text-black">{car.name}</p>
                          <p className="text-sm text-gray-600">
                            {car.category} • {car.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium text-black">₹{(car.price / 100000).toFixed(1)}L</p>
                        {car.discount > 0 && (
                          <p className="text-sm text-green-600">-₹{(car.discount / 100000).toFixed(1)}L</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-sm text-gray-600">
                        <p>
                          {car.fuelType} • {car.transmission}
                        </p>
                        <p>
                          {car.year} • {car.mileage}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge
                        className={`${
                          car.status === "active"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        } border`}
                      >
                        {car.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCar(car)}
                          className="border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleCarStatus(car.id, car.status)}
                          className="border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCar(car.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
