"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Car, DollarSign, LayoutDashboard, Settings, MapPin, Calendar, Zap, Fuel, Sparkles, Handshake } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { type CarData } from "@/components/FeatureCard"

interface CarDetailsPopupProps {
  isOpen: boolean
  onClose: () => void
  carData: CarData | null
}

export default function CarDetailsPopup({ isOpen, onClose, carData }: CarDetailsPopupProps) {
  if (!isOpen || !carData) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl rounded-3xl shadow-2xl relative bg-white dark:bg-gray-900 border border-theme-primary-200/50 overflow-hidden"
        >
          <Card className="rounded-3xl border-none">
            <CardHeader className="p-0 relative h-64 overflow-hidden">
              <Image
                src={carData.imageSrc}
                alt={carData.imageAlt}
                fill
                style={{ objectFit: "cover" }}
                className="brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                <CardTitle className="text-white text-3xl font-display font-bold">
                  {carData.name}
                </CardTitle>
                <CardDescription className="text-gray-300 mt-2">
                  {carData.description}
                </CardDescription>
                <div className="absolute top-4 right-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full bg-white/30 text-white hover:bg-white/50 backdrop-blur-sm"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 grid gap-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-theme-accent-700">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-theme-primary-500" />
                  <div>
                    <div className="font-semibold">Year</div>
                    <div className="text-theme-accent-600">{carData.year}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-theme-primary-500" />
                  <div>
                    <div className="font-semibold">Location</div>
                    <div className="text-theme-accent-600">{carData.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-theme-primary-500" />
                  <div>
                    <div className="font-semibold">Mileage</div>
                    <div className="text-theme-accent-600">{carData.mileage}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-theme-primary-500" />
                  <div>
                    <div className="font-semibold">Fuel Type</div>
                    <div className="text-theme-accent-600">{carData.fuelType}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-theme-primary-500" />
                  <div>
                    <div className="font-semibold">Transmission</div>
                    <div className="text-theme-accent-600">{carData.transmission}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-theme-primary-500" />
                  <div>
                    <div className="font-semibold">Type</div>
                    <div className="text-theme-accent-600">{carData.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-theme-primary-500" />
                  <div>
                    <div className="font-semibold">Price</div>
                    <div className="text-theme-accent-600">₹{carData.price.toLocaleString("en-IN")}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-theme-primary-500" />
                  <div>
                    <div className="font-semibold">Category</div>
                    <div className="text-theme-accent-600">{carData.category}</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <h3 className="text-lg font-bold text-theme-accent-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-theme-primary-500" /> Key Features
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-theme-accent-700">
                  {carData.mainFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {feature.icon && <feature.icon className="h-4 w-4 text-theme-secondary-500" />}
                      <span>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}