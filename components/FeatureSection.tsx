"use client"
import { useState, useMemo } from "react"
import { Car, DollarSign, LayoutDashboard, Settings, Filter, Star, Shield, Zap } from "lucide-react"
import FeatureCard, { type CarData } from "@/components/FeatureCard"
import Filters from "@/components/Features/Filters"
import TrendingTags from "@/components/Features/TrendingTags"
import MidCtaBanner from "@/components/Features/MidCtaBanner"
import BookingFormModal from "@/components/BookCarForm" // Corrected import path
import CarDetailsModal from "@/components/CarDetailsPopup" // Corrected import path
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { databaseUtils } from "@/lib/firebase"

const allCars: CarData[] = [
  // Existing 8 Cars
  {
    id: "1",
    name: "Ferrari 488 GTB",
    description: "A high-performance sports car with a powerful V8 engine and stunning design.",
    price: 36000000,
    discount: 1000000,
    imageSrc: "/images/ferrari-488-gtb.png",
    imageAlt: "Red Sports Car",
    type: "Sports",
    category: "Sports",
    location: "Mumbai",
    year: 2022,
    mainFeatures: [
      { name: "V8 Twin-Turbo Engine", icon: Zap },
      { name: "0-100 km/h in 3.0s", icon: Car },
      { name: "Carbon Ceramic Brakes", icon: Shield },
    ],
    fuelType: "Petrol",
    mileage: "8 kmpl",
    transmission: "Automatic",
  },
  {
    id: "2",
    name: "Honda City",
    description: "A reliable and fuel-efficient sedan, perfect for city driving and long commutes.",
    price: 1200000,
    discount: 50000,
    imageSrc: "/images/honda-city.png",
    imageAlt: "Blue Sedan Car",
    type: "Sedan",
    category: "Sedan",
    location: "Delhi",
    year: 2023,
    mainFeatures: [
      { name: "i-VTEC Engine", icon: Zap },
      { name: "Spacious Cabin", icon: LayoutDashboard },
      { name: "Excellent Fuel Economy", icon: DollarSign },
    ],
    fuelType: "Petrol",
    mileage: "18 kmpl",
    transmission: "Manual/Automatic",
  },
  {
    id: "3",
    name: "Mahindra XUV700",
    description: "A feature-packed SUV offering comfort, safety, and powerful performance.",
    price: 2000000,
    discount: 75000,
    imageSrc: "/images/mahindra-xuv700.png",
    imageAlt: "Black SUV Car",
    type: "SUV",
    category: "SUV",
    location: "Bangalore",
    year: 2023,
    mainFeatures: [
      { name: "AdrenoX Infotainment", icon: LayoutDashboard },
      { name: "ADAS Features", icon: Shield },
      { name: "All-Wheel Drive", icon: Settings },
    ],
    fuelType: "Petrol/Diesel",
    mileage: "15 kmpl",
    transmission: "Manual/Automatic",
  },
  {
    id: "4",
    name: "Tata Nexon EV",
    description: "India's best-selling electric SUV, offering great range and modern features.",
    price: 1500000,
    discount: 0,
    imageSrc: "/images/tata-nexon-ev.png",
    imageAlt: "White Electric Car",
    type: "Electric",
    category: "Electric",
    location: "Pune",
    year: 2023,
    mainFeatures: [
      { name: "312 km Range (ARAI)", icon: Car },
      { name: "Fast Charging Support", icon: DollarSign },
      { name: "ZConnect Connected Car Tech", icon: LayoutDashboard },
    ],
    fuelType: "Electric",
    mileage: "312 km",
    transmission: "Automatic",
  },
  {
    id: "5",
    name: "Maruti Suzuki Swift",
    description: "A popular hatchback known for its peppy engine and agile handling.",
    price: 800000,
    discount: 20000,
    imageSrc: "/images/maruti-suzuki-swift.png",
    imageAlt: "Silver Hatchback Car",
    type: "Hatchback",
    category: "Hatchback",
    location: "Chennai",
    year: 2023,
    mainFeatures: [
      { name: "K12C Engine", icon: Settings },
      { name: "Lightweight Design", icon: Car },
      { name: "Great Fuel Efficiency", icon: DollarSign },
    ],
    fuelType: "Petrol",
    mileage: "22 kmpl",
    transmission: "Manual/Automatic",
  },
  {
    id: "6",
    name: "Ford Mustang (1967)",
    description: "An iconic American muscle car, a true classic for enthusiasts.",
    price: 7500000,
    discount: 250000,
    imageSrc: "/images/ford-mustang-1976.png",
    imageAlt: "Yellow Vintage Car",
    type: "Vintage",
    category: "Classic",
    location: "Mumbai",
    year: 1967,
    mainFeatures: [
      { name: "V8 Power", icon: Zap },
      { name: "Classic Design", icon: Star },
      { name: "Collector's Item", icon: Shield },
    ],
    fuelType: "Petrol",
    mileage: "50,000 km",
    transmission: "Manual",
  },
  {
    id: "7",
    name: "BMW 3 Series",
    description: "A luxury sedan that combines performance with sophistication.",
    price: 4500000,
    discount: 150000,
    imageSrc: "/images/bmw-3-series.png",
    imageAlt: "White Luxury Sedan",
    type: "Luxury",
    category: "Luxury",
    location: "Delhi",
    year: 2023,
    mainFeatures: [
      { name: "TwinPower Turbo", icon: Zap },
      { name: "iDrive 7.0", icon: LayoutDashboard },
      { name: "Premium Interior", icon: Star },
    ],
    fuelType: "Petrol/Diesel",
    mileage: "12 kmpl",
    transmission: "Automatic",
  },
  {
    id: "8",
    name: "Hyundai i20",
    description: "A premium hatchback with modern features and excellent build quality.",
    price: 900000,
    discount: 30000,
    imageSrc: "/images/hyundai.png",
    imageAlt: "Red Hatchback Car",
    type: "Hatchback",
    category: "Hatchback",
    location: "Bangalore",
    year: 2023,
    mainFeatures: [
      { name: "SmartSense Features", icon: Shield },
      { name: "Connected Car Tech", icon: LayoutDashboard },
      { name: "Premium Design", icon: Star },
    ],
    fuelType: "Petrol",
    mileage: "20 kmpl",
    transmission: "Manual/Automatic",
  },

  // Newly Added 12 Cars
  {
    id: "9",
    name: "Audi Q5",
    description: "A sophisticated luxury SUV that blends performance with everyday usability.",
    price: 6500000,
    discount: 200000,
    imageSrc: "/images/audi-q7.png",
    imageAlt: "White Audi Q5 SUV",
    type: "Luxury",
    category: "SUV",
    location: "Mumbai",
    year: 2023,
    mainFeatures: [
      { name: "Quattro All-Wheel Drive", icon: Settings },
      { name: "Virtual Cockpit Display", icon: LayoutDashboard },
      { name: "Matrix LED Headlights", icon: Star },
    ],
    fuelType: "Petrol",
    mileage: "13 kmpl",
    transmission: "Automatic",
  },
  {
    id: "10",
    name: "Mercedes-Benz C-Class",
    description: "The 'Baby S-Class' offers unparalleled luxury and cutting-edge tech in the sedan segment.",
    price: 6000000,
    discount: 250000,
    imageSrc: "/images/mercedez-c-class.png",
    imageAlt: "Black Mercedes-Benz C-Class Sedan",
    type: "Luxury",
    category: "Sedan",
    location: "Delhi",
    year: 2023,
    mainFeatures: [
      { name: "MBUX Infotainment", icon: LayoutDashboard },
      { name: "Plush Interiors", icon: Star },
      { name: "Agile Handling", icon: Car },
    ],
    fuelType: "Petrol/Diesel",
    mileage: "16 kmpl",
    transmission: "Automatic",
  },
  {
    id: "11",
    name: "Jeep Compass",
    description: "A rugged and capable SUV with iconic styling and a premium interior.",
    price: 2200000,
    discount: 80000,
    imageSrc: "/images/jeep-compass.png",
    imageAlt: "Grey Jeep Compass SUV",
    type: "SUV",
    category: "SUV",
    location: "Pune",
    year: 2023,
    mainFeatures: [
      { name: "4x4 Capability", icon: Shield },
      { name: "Uconnect 5 System", icon: LayoutDashboard },
      { name: "Panoramic Sunroof", icon: Star },
    ],
    fuelType: "Petrol/Diesel",
    mileage: "14 kmpl",
    transmission: "Manual/Automatic",
  },
  {
    id: "12",
    name: "Kia Seltos",
    description: "A stylish and feature-rich SUV that has taken the market by storm.",
    price: 1800000,
    discount: 60000,
    imageSrc: "/images/kia-seltos.png",
    imageAlt: "Orange Kia Seltos SUV",
    type: "SUV",
    category: "SUV",
    location: "Hyderabad",
    year: 2023,
    mainFeatures: [
      { name: "BOSE Sound System", icon: Star },
      { name: "Ventilated Seats", icon: Settings },
      { name: "Smart Air Purifier", icon: Shield },
    ],
    fuelType: "Petrol/Diesel",
    mileage: "17 kmpl",
    transmission: "Manual/Automatic",
  },
  {
    id: "13",
    name: "MG Hector",
    description: "The 'Internet Inside' SUV with a massive touchscreen and spacious cabin.",
    price: 2100000,
    discount: 90000,
    imageSrc: "/images/mg-hector.png",
    imageAlt: "Red MG Hector SUV",
    type: "SUV",
    category: "SUV",
    location: "Ahmedabad",
    year: 2023,
    mainFeatures: [
      { name: "14-inch Touchscreen", icon: LayoutDashboard },
      { name: "AI Voice Assistant", icon: Zap },
      { name: "Spacious Legroom", icon: Car },
    ],
    fuelType: "Petrol/Diesel",
    mileage: "13 kmpl",
    transmission: "Automatic",
  },
  {
    id: "14",
    name: "Nissan Magnite",
    description: "A compact SUV offering bold design and great value for money.",
    price: 950000,
    discount: 40000,
    imageSrc: "/images/nissan-magnite.png",
    imageAlt: "Silver Nissan Magnite Compact SUV",
    type: "Compact",
    category: "SUV",
    location: "Kolkata",
    year: 2023,
    mainFeatures: [
      { name: "Turbo Engine Option", icon: Zap },
      { name: "Wireless CarPlay", icon: LayoutDashboard },
      { name: "Tech Pack", icon: Settings },
    ],
    fuelType: "Petrol",
    mileage: "20 kmpl",
    transmission: "Manual/Automatic",
  },
  {
    id: "15",
    name: "Porsche 911",
    description: "The quintessential sports car with timeless design and exhilarating performance.",
    price: 21000000,
    discount: 0,
    imageSrc: "/images/porche-911.png",
    imageAlt: "Yellow Porsche 911 Sports Car",
    type: "Sports",
    category: "Sports",
    location: "Mumbai",
    year: 2023,
    mainFeatures: [
      { name: "PDK Transmission", icon: Settings },
      { name: "Iconic Silhouette", icon: Star },
      { name: "Rear-Engine Layout", icon: Car },
    ],
    fuelType: "Petrol",
    mileage: "9 kmpl",
    transmission: "Automatic",
  },
  {
    id: "16",
    name: "Renault Kwid",
    description: "An entry-level hatchback with SUV-inspired looks and a digital instrument cluster.",
    price: 470000,
    discount: 15000,
    imageSrc: "/images/renault-kwid.png",
    imageAlt: "Blue Renault Kwid Hatchback",
    type: "Hatchback",
    category: "Hatchback",
    location: "Chennai",
    year: 2023,
    mainFeatures: [
      { name: "High Ground Clearance", icon: Shield },
      { name: "Digital Instrument Cluster", icon: LayoutDashboard },
      { name: "Budget Friendly", icon: DollarSign },
    ],
    fuelType: "Petrol",
    mileage: "22 kmpl",
    transmission: "Manual",
  },
  {
    id: "17",
    name: "Rolls-Royce Phantom",
    description: "The pinnacle of automotive luxury, offering a bespoke and serene travel experience.",
    price: 100000000,
    discount: 0,
    imageSrc: "/images/rolls-roys-phantom.png",
    imageAlt: "Black Rolls-Royce Phantom Luxury Car",
    type: "Luxury",
    category: "Luxury",
    location: "Delhi",
    year: 2023,
    mainFeatures: [
      { name: "Starlight Headliner", icon: Star },
      { name: "Magic Carpet Ride", icon: Car },
      { name: "Coach Doors", icon: Settings },
    ],
    fuelType: "Petrol",
    mileage: "7 kmpl",
    transmission: "Automatic",
  },
  {
    id: "18",
    name: "Skoda Slavia",
    description: "A dynamic sedan with a powerful TSI engine and a high safety rating.",
    price: 1600000,
    discount: 65000,
    imageSrc: "/images/skoda-slavia.png",
    imageAlt: "Red Skoda Slavia Sedan",
    type: "Sedan",
    category: "Sedan",
    location: "Pune",
    year: 2023,
    mainFeatures: [
      { name: "1.5L TSI Engine", icon: Zap },
      { name: "5-Star Safety Rating", icon: Shield },
      { name: "Large Boot Space", icon: LayoutDashboard },
    ],
    fuelType: "Petrol",
    mileage: "19 kmpl",
    transmission: "Manual/Automatic",
  },
  {
    id: "19",
    name: "Toyota Innova Crysta",
    description: "The undisputed king of MPVs, known for its reliability, comfort, and resale value.",
    price: 2500000,
    discount: 50000,
    imageSrc: "/images/toyota-innova-crysta.png",
    imageAlt: "White Toyota Innova Crysta MPV",
    type: "SUV", // Using SUV as the closest category type
    category: "SUV",
    location: "Bangalore",
    year: 2023,
    mainFeatures: [
      { name: "Captain Seats", icon: Star },
      { name: "Unmatched Reliability", icon: Shield },
      { name: "Spacious 7-seater", icon: Car },
    ],
    fuelType: "Diesel",
    mileage: "12 kmpl",
    transmission: "Manual",
  },
  {
    id: "20",
    name: "Volkswagen Virtus",
    description: "A sophisticated sedan with German engineering, offering a fun-to-drive experience.",
    price: 1700000,
    discount: 70000,
    imageSrc: "/images/volkswagen-virtus.png",
    imageAlt: "Yellow Volkswagen Virtus Sedan",
    type: "Sedan",
    category: "Sedan",
    location: "Mumbai",
    year: 2023,
    mainFeatures: [
      { name: "GT Performance Line", icon: Zap },
      { name: "Digital Cockpit", icon: LayoutDashboard },
      { name: "Solid Build Quality", icon: Shield },
    ],
    fuelType: "Petrol",
    mileage: "18 kmpl",
    transmission: "Manual/Automatic",
  },
]

export default function FeatureSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [carTypeFilter, setCarTypeFilter] = useState<string>("All")
  const [priceRangeFilter, setPriceRangeFilter] = useState<string>("All")
  const [activeTag, setActiveTag] = useState<string>("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // State for modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null)

  const { user } = useAuth()
  const router = useRouter()

  const handleBookNowClick = async (carId: string) => {
    if (!user) {
      toast.error("Please sign in to book a car.")
      router.push("/auth/signin")
      return
    }

    const car = allCars.find((c) => c.id === carId)
    if (car) {
      setSelectedCar(car)
      setIsBookingModalOpen(true)

      // Track the interaction
      await databaseUtils.saveFeatureInteraction({
        userId: user.uid,
        featureId: car.id,
        action: "contact",
        timestamp: new Date().toISOString(),
      })
    }
  }

  const handleLearnMoreClick = async (carId: string) => {
    const car = allCars.find((c) => c.id === carId)
    if (car) {
      setSelectedCar(car)
      setIsDetailsModalOpen(true)

      // Track the interaction if a user is logged in
      if (user) {
        await databaseUtils.saveFeatureInteraction({
          userId: user.uid,
          featureId: car.id,
          action: "view",
          timestamp: new Date().toISOString(),
        })
      }
    }
  }

  const handleTagClick = (tag: string) => {
    setActiveTag(tag === activeTag ? "" : tag)
    setSearchTerm("")
    setCarTypeFilter("All")
    setPriceRangeFilter("All")

    if (tag === "Top Deals") {
      setPriceRangeFilter("All")
    } else if (tag === "Under ₹5L") {
      setPriceRangeFilter("Under 5L")
    } else if (tag === "Electric Cars") {
      setCarTypeFilter("Electric")
    } else if (tag === "SUVs") {
      setCarTypeFilter("SUV")
    } else if (tag === "Sedans") {
      setCarTypeFilter("Sedan")
    } else if (tag === "Hatchbacks") {
      setCarTypeFilter("Hatchback")
    } else if (tag === "Luxury Cars") {
      setCarTypeFilter("Luxury")
    } else if (tag === "Vintage") {
      setCarTypeFilter("Vintage")
    }
  }

  const filteredCars = useMemo(() => {
    let cars = allCars

    if (searchTerm) {
      cars = cars.filter((car) => car.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (carTypeFilter !== "All") {
      cars = cars.filter((car) => car.type === carTypeFilter)
    }

    if (priceRangeFilter !== "All") {
      cars = cars.filter((car) => {
        const price = car.price
        switch (priceRangeFilter) {
          case "Under 5L":
            return price <= 500000
          case "5L-10L":
            return price > 500000 && price <= 1000000
          case "10L-25L":
            return price > 1000000 && price <= 2500000
          case "25L-50L":
            return price > 2500000 && price <= 5000000
          case "Over 50L":
            return price > 5000000
          default:
            return true
        }
      })
    }

    if (activeTag) {
      if (activeTag === "Top Deals") {
        cars = cars.filter((car) => car.discount && car.discount > 0)
      } else if (activeTag === "Under ₹5L") {
        cars = cars.filter((car) => car.price <= 500000)
      } else if (activeTag === "Electric Cars") {
        cars = cars.filter((car) => car.type === "Electric")
      } else if (activeTag === "EMI Options") {
        // Placeholder for EMI options logic
      } else if (activeTag === "SUVs") {
        cars = cars.filter((car) => car.type === "SUV" || car.category === "SUV")
      } else if (activeTag === "Sedans") {
        cars = cars.filter((car) => car.type === "Sedan")
      } else if (activeTag === "Hatchbacks") {
        cars = cars.filter((car) => car.type === "Hatchback")
      } else if (activeTag === "Luxury Cars") {
        cars = cars.filter((car) => car.type === "Luxury")
      } else if (activeTag === "Vintage") {
        cars = cars.filter((car) => car.type === "Vintage")
      }
    }
    return cars
  }, [searchTerm, carTypeFilter, priceRangeFilter, activeTag])

  return (
    <section
      id="features"
      className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-theme-accent-50 via-white to-theme-primary-50/30"
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16 animate-fade-in-up">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold gradient-text-primary">
              Explore All Cars
            </h2>
            <p className="max-w-3xl text-theme-accent-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed leading-relaxed">
              Find your perfect car with our advanced search and filtering options. Discover amazing deals and premium
              vehicles tailored to your needs.
            </p>
          </div>
          <div className="w-full max-w-4xl">
            <Filters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              carTypeFilter={carTypeFilter}
              setCarTypeFilter={setCarTypeFilter}
              priceRangeFilter={priceRangeFilter}
              setPriceRangeFilter={setPriceRangeFilter}
            />
            <TrendingTags onTagClick={handleTagClick} activeTag={activeTag} />
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <p className="text-theme-accent-600">
            Showing <span className="font-semibold text-theme-accent-900">{filteredCars.length}</span> cars
          </p>
          <div className="flex items-center gap-2 text-sm text-theme-accent-600">
            <Filter className="h-4 w-4" />
            <span>Active filters: {[carTypeFilter, priceRangeFilter, activeTag].filter(Boolean).length}</span>
          </div>
        </div>

        <motion.div
          className={`grid gap-6 md:gap-8 ${
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" : "grid-cols-1"
          } justify-items-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {filteredCars.length > 0 ? (
            filteredCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <FeatureCard {...car} onBookNowClick={handleBookNowClick} onLearnMoreClick={handleLearnMoreClick} />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-theme-accent-100 rounded-full flex items-center justify-center">
                  <Car className="w-12 h-12 text-theme-accent-400" />
                </div>
                <h3 className="text-xl font-display font-semibold text-theme-accent-900 mb-3">No cars found</h3>
                <p className="text-theme-accent-600 mb-6">
                  No cars match your current search criteria. Try adjusting your filters or search terms.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setCarTypeFilter("All")
                    setPriceRangeFilter("All")
                    setActiveTag("")
                  }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
                >
                  Clear All Filters
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <MidCtaBanner />

        <div className="flex justify-center mt-16 animate-fade-in-up">
          <Link href="/contact">
            <Button className="bg-secondary text-amber-500 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Contact Us for More Options
            </Button>
          </Link>
        </div>
      </div>

      <BookingFormModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        carData={selectedCar}
      />
      <CarDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} carData={selectedCar} />
    </section>
  )
}
