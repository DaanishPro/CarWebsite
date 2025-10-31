"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

interface CarCardProps {
  imageSrc: string
  imageAlt: string
  name: string
  description: string
  price: number
  discount?: number
}

export default function CarCard({ imageSrc, imageAlt, name, description, price, discount }: CarCardProps) {
  const discountedPrice = discount ? price - discount : price
  const { user } = useAuth()
  const router = useRouter()

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please sign in to buy a car.")
      router.push("/auth/signin")
    } else {
      toast.success(`You clicked Buy Now for ${name}! (Placeholder action)`)
      // Implement actual buying logic here
    }
  }

  return (
    <Card className="w-full max-w-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <div className="relative w-full h-48">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={imageAlt}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-t-lg"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <CardDescription className="text-sm text-gray-600 line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-yellow-600">₹{discountedPrice.toLocaleString("en-IN")}</span>
          {discount && (
            <>
              <span className="text-sm text-gray-500 line-through">₹{price.toLocaleString("en-IN")}</span>
              <span className="text-sm text-green-600 font-semibold">Save ₹{discount.toLocaleString("en-IN")}</span>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleBuyNow} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  )
}
