"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Car, Upload, Plus, X } from "lucide-react"
import { ref, set, push } from "firebase/database"
import { realtimeDb } from "@/firebase/config"
import { toast } from "react-hot-toast"

interface CarFormData {
  name: string
  price: string
  discount: string
  category: string
  fuelType: string
  transmission: string
  year: string
  location: string
  mileage: string
  description: string
  imageUrl: string
  features: string[]
}

const carCategories = ["Sports", "Sedan", "SUV", "Hatchback", "Electric", "Classic"]
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"]
const transmissionTypes = ["Manual", "Automatic", "CVT"]
const locations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Pune", "Hyderabad", "Kolkata"]

const availableFeatures = [
  "Air Conditioning",
  "Power Steering",
  "Power Windows",
  "ABS",
  "Airbags",
  "Alloy Wheels",
  "Fog Lights",
  "Central Locking",
  "Keyless Entry",
  "Bluetooth Connectivity",
  "USB Charging",
  "Reverse Camera",
  "GPS Navigation",
  "Sunroof",
  "Leather Seats",
  "Heated Seats",
  "Cruise Control",
  "Parking Sensors",
]

export default function AddNewCar() {
  const [formData, setFormData] = useState<CarFormData>({
    name: "",
    price: "",
    discount: "",
    category: "",
    fuelType: "",
    transmission: "",
    year: "",
    location: "",
    mileage: "",
    description: "",
    imageUrl: "",
    features: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a storage service
      // For now, we'll use a placeholder URL
      const imageUrl = `/images/${file.name}`
      setFormData((prev) => ({ ...prev, imageUrl }))
      toast.success("Image uploaded successfully!")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    if (!formData.name || !formData.price || !formData.category || !formData.fuelType || !formData.transmission) {
      toast.error("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    try {
      const carsRef = ref(realtimeDb, "cars")
      const newCarRef = push(carsRef)

      const carData = {
        id: newCarRef.key,
        name: formData.name,
        price: Number.parseInt(formData.price),
        discount: Number.parseInt(formData.discount) || 0,
        category: formData.category,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        year: Number.parseInt(formData.year) || new Date().getFullYear(),
        location: formData.location,
        mileage: formData.mileage,
        description: formData.description,
        imageSrc:
          formData.imageUrl || `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(formData.name)}`,
        imageAlt: formData.name,
        type: formData.category,
        mainFeatures: formData.features.slice(0, 3).map((feature) => ({ name: feature })),
        allFeatures: formData.features,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await set(newCarRef, carData)

      toast.success("Car added successfully!")

      // Reset form
      setFormData({
        name: "",
        price: "",
        discount: "",
        category: "",
        fuelType: "",
        transmission: "",
        year: "",
        location: "",
        mileage: "",
        description: "",
        imageUrl: "",
        features: [],
      })
    } catch (error) {
      console.error("Error adding car:", error)
      toast.error("Failed to add car")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-black flex items-center gap-2">
          <Car className="h-5 w-5" />
          Add New Car to Website
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Car Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., BMW 3 Series"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {carCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="1500000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Amount (₹)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="2024"
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black">Technical Specifications</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type *</Label>
                <Select onValueChange={(value) => handleSelectChange("fuelType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((fuel) => (
                      <SelectItem key={fuel} value={fuel}>
                        {fuel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission *</Label>
                <Select onValueChange={(value) => handleSelectChange("transmission", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissionTypes.map((trans) => (
                      <SelectItem key={trans} value={trans}>
                        {trans}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  placeholder="15 kmpl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select onValueChange={(value) => handleSelectChange("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black">Car Image</h3>

            <div className="space-y-2">
              <Label htmlFor="image">Upload Car Image</Label>
              <div className="flex items-center gap-4">
                <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
                <Button type="button" variant="outline" className="border-gray-200 bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl || "/placeholder.svg"}
                    alt="Car preview"
                    className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black">Description</h3>

            <div className="space-y-2">
              <Label htmlFor="description">Car Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the car's key features and benefits..."
                rows={4}
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black">Features</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={formData.features.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label htmlFor={feature} className="text-sm">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>

            {formData.features.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Selected Features ({formData.features.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleFeatureToggle(feature)}
                        className="hover:bg-red-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button type="submit" disabled={isSubmitting} className="bg-red-500 hover:bg-red-600 text-white">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Car...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Car to Website
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Save as Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
