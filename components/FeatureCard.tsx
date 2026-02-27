"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import type React from "react"
import { Star, Heart, Eye, ShoppingCart, TrendingUp, MapPin, Calendar, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { databaseUtils } from "@/lib/firebase"

interface Feature {
  name: string
  icon: React.ElementType
}

export interface CarData {
  id: string
  name: string
  description: string
  price: number
  discount?: number
  imageSrc: string
  imageAlt: string
  type: "Sedan" | "SUV" | "Hatchback" | "Sports" | "Electric" | "Vintage" | "Luxury" | "Compact"
  mainFeatures: Feature[]
  fuelType: string
  mileage: string
  transmission: string
  category: string
  location: string
  year: number
}

interface FeatureCardProps extends CarData {
  onBookNowClick: (carId: string) => void
  onLearnMoreClick: (carId: string) => void
}

export default function FeatureCard({
  id,
  imageSrc,
  imageAlt,
  name,
  description,
  price,
  discount,
  mainFeatures,
  category = "Sedan",
  location = "Mumbai",
  year = 2023,
  mileage = "15,000 km",
  onBookNowClick,
  onLearnMoreClick,
}: FeatureCardProps) {
  const discountedPrice = discount ? price - discount : price
  const { user } = useAuth()
  const router = useRouter()

  const handleLike = async () => {
    if (!user) {
      toast.error("Please sign in to like cars.")
      router.push("/auth/signin")
      return
    }

    await databaseUtils.saveFeatureInteraction({
      userId: user.uid,
      featureId: id,
      action: 'like',
      timestamp: new Date().toISOString(),
    })

    toast.success(`Added ${name} to favorites!`)
  }

  return (
    <motion.div
      className="group animate-fade-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="w-full max-w-sm rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-500 bg-gradient-card border-0 group-hover:border-theme-primary-200/50 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={imageAlt}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-2xl group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount && (
              <motion.div
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                Save ₹{discount.toLocaleString("en-IN")}
              </motion.div>
            )}
            <motion.div
              className="bg-gradient-to-r from-yellow-500 to-orange-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Hot Deal
            </motion.div>
            <motion.div
              className="bg-blue-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              {category}
            </motion.div>
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.button
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-theme-accent-700 hover:text-red-500 hover:bg-white transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
            >
              <Heart className="h-4 w-4" />
            </motion.button>
            <motion.button
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-theme-accent-700 hover:text-blue-500 hover:bg-white transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onLearnMoreClick(id)}
            >
              <Eye className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-display font-bold text-theme-accent-900 group-hover:text-theme-primary-600 transition-colors duration-300">
            {name}
          </CardTitle>
          <CardDescription className="text-sm text-theme-accent-600 line-clamp-2 leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 pb-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>{mileage}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-display font-bold gradient-text-primary">
              ₹{discountedPrice.toLocaleString("en-IN")}
            </span>
            {discount && (
              <span className="text-sm text-theme-accent-500 line-through">
                ₹{price.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {mainFeatures.slice(0, 3).map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 text-sm text-theme-accent-700"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {feature.icon && (
                  <feature.icon className="h-4 w-4 text-theme-primary-500 flex-shrink-0" />
                )}
                <span>{feature.name}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-theme-secondary-400 fill-current" />
            ))}
            <span className="text-xs text-theme-accent-600 ml-2">(4.8)</span>
          </div>
        </CardContent>

        <CardFooter className="pt-0 flex gap-2">
          <Button
            onClick={() => onLearnMoreClick(id)}
            variant="ghost"
            className="flex-1 border border-yellow-500 text-yellow-600 bg-white/90 hover:bg-yellow-500 hover:text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md"
          >
            <Eye className="h-4 w-4 mr-2" />
            Learn More
          </Button>
          <Button
            onClick={() => onBookNowClick(id)}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl group-hover:shadow-glow"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}