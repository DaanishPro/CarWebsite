"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, Trash2, MapPin, Phone, Mail, Edit } from "lucide-react"
import { ref, set, get, remove, push } from "firebase/database"
import { realtimeDb } from "@/firebase/config"
import { toast } from "react-hot-toast"

interface Showroom {
  id: string
  name: string
  address: string
  city: string
  state: string
  phone: string
  email: string
  manager: string
  status: "active" | "inactive"
  createdAt: string
}

export default function ManageShowroom() {
  const [activeTab, setActiveTab] = useState<"list" | "add">("list")
  const [showrooms, setShowrooms] = useState<Showroom[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    manager: "",
  })

  useEffect(() => {
    fetchShowrooms()
  }, [])

  const fetchShowrooms = async () => {
    try {
      const showroomsRef = ref(realtimeDb, "showrooms")
      const snapshot = await get(showroomsRef)

      if (snapshot.exists()) {
        const data = snapshot.val()
        const showroomsList = Object.entries(data).map(([id, showroom]: [string, any]) => ({
          id,
          ...showroom,
        }))
        setShowrooms(showroomsList)
      }
    } catch (error) {
      console.error("Error fetching showrooms:", error)
      toast.error("Failed to fetch showrooms")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddShowroom = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.address || !formData.city || !formData.phone) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const showroomsRef = ref(realtimeDb, "showrooms")
      const newShowroomRef = push(showroomsRef)

      const newShowroom: Omit<Showroom, "id"> = {
        ...formData,
        status: "active",
        createdAt: new Date().toISOString(),
      }

      await set(newShowroomRef, newShowroom)

      toast.success("Showroom added successfully!")
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        phone: "",
        email: "",
        manager: "",
      })
      setActiveTab("list")
      fetchShowrooms()
    } catch (error) {
      console.error("Error adding showroom:", error)
      toast.error("Failed to add showroom")
    }
  }

  const handleDeleteShowroom = async (showroomId: string) => {
    if (!confirm("Are you sure you want to delete this showroom?")) {
      return
    }

    try {
      const showroomRef = ref(realtimeDb, `showrooms/${showroomId}`)
      await remove(showroomRef)

      toast.success("Showroom deleted successfully!")
      fetchShowrooms()
    } catch (error) {
      console.error("Error deleting showroom:", error)
      toast.error("Failed to delete showroom")
    }
  }

  const toggleShowroomStatus = async (showroomId: string, currentStatus: string) => {
    try {
      const showroomRef = ref(realtimeDb, `showrooms/${showroomId}/status`)
      const newStatus = currentStatus === "active" ? "inactive" : "active"

      await set(showroomRef, newStatus)

      toast.success(`Showroom ${newStatus === "active" ? "activated" : "deactivated"} successfully!`)
      fetchShowrooms()
    } catch (error) {
      console.error("Error updating showroom status:", error)
      toast.error("Failed to update showroom status")
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

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4">
        <Button
          variant={activeTab === "list" ? "default" : "outline"}
          onClick={() => setActiveTab("list")}
          className={
            activeTab === "list" ? "bg-red-500 hover:bg-red-600" : "border-gray-200 text-gray-700 hover:bg-gray-50"
          }
        >
          <Building2 className="h-4 w-4 mr-2" />
          Registered Showrooms
        </Button>
        <Button
          variant={activeTab === "add" ? "default" : "outline"}
          onClick={() => setActiveTab("add")}
          className={
            activeTab === "add" ? "bg-red-500 hover:bg-red-600" : "border-gray-200 text-gray-700 hover:bg-gray-50"
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Showroom
        </Button>
      </div>

      {/* Content */}
      {activeTab === "list" ? (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Registered Showrooms ({showrooms.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showrooms.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No showrooms registered yet</p>
                <Button onClick={() => setActiveTab("add")} className="mt-4 bg-red-500 hover:bg-red-600 text-white">
                  Add First Showroom
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {showrooms.map((showroom) => (
                  <Card key={showroom.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-black">{showroom.name}</h3>
                        <Badge
                          className={`${
                            showroom.status === "active"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          } border`}
                        >
                          {showroom.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {showroom.address}, {showroom.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{showroom.phone}</span>
                        </div>
                        {showroom.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{showroom.email}</span>
                          </div>
                        )}
                        {showroom.manager && (
                          <div className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            <span>Manager: {showroom.manager}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleShowroomStatus(showroom.id, showroom.status)}
                          className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          {showroom.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteShowroom(showroom.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Showroom
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddShowroom} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Showroom Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter showroom name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager Name</Label>
                  <Input
                    id="manager"
                    name="manager"
                    value={formData.manager}
                    onChange={handleInputChange}
                    placeholder="Enter manager name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter complete address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">
                  Add Showroom
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("list")}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
