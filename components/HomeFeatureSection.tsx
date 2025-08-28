// components/HomeFeatureSection.tsx

'use client'; 

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Shield, Zap, Car } from "lucide-react";
import FeatureCard, { type CarData } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BookingFormModal from "@/components/BookCarForm"; // Assuming this path is correct
import CarDetailsModal from "@/components/CarDetailsPopup"; // Assuming this path is correct
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { databaseUtils } from "@/lib/firebase"; // Assuming this path is correct

// The car data for this specific section
const homeCars: CarData[] = [
  {
    id: "ferrari-488-gtb",
    imageSrc: "/images/ferrari-488-gtb.png",
    imageAlt: "Red Sports Car",
    name: "Ferrari 488 GTB",
    description: "A high-performance sports car with a powerful V8 engine and stunning design.",
    price: 36000000,
    discount: 1000000,
    type: "Sports",
    fuelType: "Petrol",
    transmission: "Automatic",
    category: "Sports",
    location: "Mumbai",
    year: 2022,
    mileage: "5,000 km",
    mainFeatures: [
      { name: "V8 Engine", icon: Zap },
      { name: "Carbon Fiber", icon: Shield },
      { name: "Premium Interior", icon: Star },
    ],
  },
  {
    id: "honda-city",
    imageSrc: "/images/honda-city.png",
    imageAlt: "Blue Sedan Car",
    name: "Honda City",
    description: "A reliable and fuel-efficient sedan, perfect for city driving and long commutes.",
    price: 1200000,
    discount: 50000,
    type: "Sedan",
    fuelType: "Petrol",
    transmission: "Manual",
    category: "Sedan",
    location: "Delhi",
    year: 2023,
    mileage: "12,000 km",
    mainFeatures: [
      { name: "Fuel Efficient", icon: Zap },
      { name: "Spacious Interior", icon: Car },
      { name: "Advanced Safety", icon: Shield },
    ],
  },
  {
    id: "mahindra-xuv700",
    imageSrc: "/images/mahindra-xuv700.png",
    imageAlt: "Black SUV Car",
    name: "Mahindra XUV700",
    description: "A feature-packed SUV offering comfort, safety, and powerful performance.",
    price: 2000000,
    discount: 75000,
    type: "SUV",
    fuelType: "Petrol",
    transmission: "Automatic",
    category: "SUV",
    location: "Bangalore",
    year: 2023,
    mileage: "8,000 km",
    mainFeatures: [
      { name: "7 Seater", icon: Car },
      { name: "ADAS Features", icon: Shield },
      { name: "Turbo Engine", icon: Zap },
    ],
  },
  {
    id: "tata-nexon-ev",
    imageSrc: "/images/tata-nexon-ev.png",
    imageAlt: "White Electric Car",
    name: "Tata Nexon EV",
    description: "India's best-selling electric SUV, offering great range and modern features.",
    price: 1500000,
    discount: 0,
    type: "Electric",
    fuelType: "Electric",
    transmission: "Automatic",
    category: "Electric",
    location: "Pune",
    year: 2023,
    mileage: "3,000 km",
    mainFeatures: [
      { name: "300km Range", icon: Zap },
      { name: "Zero Emissions", icon: Shield },
      { name: "Fast Charging", icon: Star },
    ],
  },
  {
    id: "maruti-suzuki-swift",
    imageSrc: "/images/maruti-suzuki-swift.png",
    imageAlt: "Silver Hatchback Car",
    name: "Maruti Suzuki Swift",
    description: "A popular hatchback known for its peppy engine and agile handling.",
    price: 800000,
    discount: 20000,
    type: "Hatchback",
    fuelType: "Petrol",
    transmission: "Manual",
    category: "Hatchback",
    location: "Chennai",
    year: 2023,
    mileage: "10,000 km",
    mainFeatures: [
      { name: "Peppy Engine", icon: Zap },
      { name: "Easy Maintenance", icon: Car },
      { name: "Great Mileage", icon: Star },
    ],
  },
  {
    id: "ford-mustang-1976",
    imageSrc: "/images/ford-mustang-1976.png",
    imageAlt: "Yellow Vintage Car",
    name: "Ford Mustang (1967)",
    description: "An iconic American muscle car, a true classic for enthusiasts.",
    price: 7500000,
    discount: 250000,
    type: "Vintage",
    fuelType: "Petrol",
    transmission: "Manual",
    category: "Classic",
    location: "Mumbai",
    year: 1967,
    mileage: "50,000 km",
    mainFeatures: [
      { name: "V8 Power", icon: Zap },
      { name: "Classic Design", icon: Star },
      { name: "Collector's Item", icon: Shield },
    ],
  },
];

// Stagger animation variants for the parent container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Each child will animate 0.1s after the previous one
    },
  },
};

// Animation variants for each card item
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function HomeFeatureSection() {
  const { user } = useAuth();
  const router = useRouter();

  // State for modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null);

  const handleBookNowClick = async (carId: string) => {
    if (!user) {
      toast.error("Please sign in to book a car.");
      router.push("/auth/signin");
      return;
    }

    const car = homeCars.find(c => c.id === carId);
    if (car) {
      setSelectedCar(car);
      setIsBookingModalOpen(true);
      
      await databaseUtils.saveFeatureInteraction({
        userId: user.uid,
        featureId: car.id,
        action: 'contact',
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleLearnMoreClick = async (carId: string) => {
    const car = homeCars.find(c => c.id === carId);
    if (car) {
      setSelectedCar(car);
      setIsDetailsModalOpen(true);
      
      if (user) {
        await databaseUtils.saveFeatureInteraction({
          userId: user.uid,
          featureId: car.id,
          action: 'view',
          timestamp: new Date().toISOString(),
        });
      }
    }
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#C92121]">
              Featured Cars
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover some of the best cars available on YeloCar.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {homeCars.map((car) => (
            <motion.div key={car.id} variants={itemVariants}>
              <FeatureCard 
                {...car} 
                onBookNowClick={handleBookNowClick}
                onLearnMoreClick={handleLearnMoreClick}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link href="/features">
            <Button className="bg-gradient-to-r from-[#DC2626] to-[#A61B1B] hover:from-[#DC2626] hover:to-[#A61B1B] text-white text-lg px-8 py-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Explore More Cars
            </Button>
          </Link>
        </motion.div>
      </div>
      
      {/* Modals are rendered here */}
      <BookingFormModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        carData={selectedCar}
      />
      <CarDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        carData={selectedCar}
      />
    </section>
  );
}