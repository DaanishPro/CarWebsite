"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, ArrowRight, Star } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

// Simple client-side only component to avoid SSR issues
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <>{children}</>
}

const images = [
  {
    src: "/images/hero-car-1.png",
    alt: "White Dodge Challenger at night with light trails",
    title: "Premium Performance",
    subtitle: "Experience luxury and power combined"
  },
  {
    src: "/images/hero-car-2.png",
    alt: "White Dodge Challenger at night with light trails",
    title: "Smart Selling",
    subtitle: "Get the best value for your vehicle"
  },
  {
    src: "/images/hero-car-3.png",
    alt: "White Dodge Challenger at night with light trails",
    title: "Trusted Platform",
    subtitle: "Join thousands of satisfied customers"
  },
]

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // Auto-slide every 5 seconds
    
    return () => clearInterval(interval)
  }, [isPlaying])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section className="relative w-full h-[500px] md:h-[700px] lg:h-[800px] overflow-hidden bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Image Slider */}
      <ClientOnly>
        <div className="absolute inset-0">
          <Image
            key={images[currentIndex].src}
            src={images[currentIndex].src || "/placeholder.svg"}
            alt={images[currentIndex].alt}
            fill
            style={{ objectFit: "cover" }}
            priority
            className="transition-all duration-1000 ease-in-out"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-theme-accent-900/80 via-theme-accent-900/60 to-theme-accent-900/40"></div>
        </div>
      </ClientOnly>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-theme-secondary-500/20 backdrop-blur-sm border border-theme-secondary-300/30 px-4 py-2 rounded-full text-theme-secondary-300 text-sm font-medium animate-fade-in">
            <Star className="h-4 w-4" />
            <span>India's #1 Car Selling Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white text-shadow-lg leading-tight animate-fade-in-up">
            {images[currentIndex].title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-theme-accent-200 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
            {images[currentIndex].subtitle}
          </p>

          {/* CTA Buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fade-in-up">
            <Button 
              size="lg"
              className="bg-gradient-secondary hover:bg-gradient-secondary text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Selling Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 font-semibold px-8 py-4 text-lg rounded-xl backdrop-blur-sm transition-all duration-300"
            >
              Learn More
            </Button>
          </div> */}

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-12 animate-fade-in-up">
            {[
              { label: "Cars Sold", value: "10,000+" },
              { label: "Happy Customers", value: "50,000+" },
              { label: "Cities Covered", value: "100+" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-theme-secondary-400">
                  {stat.value}
                </div>
                <div className="text-sm text-theme-accent-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-theme-secondary-400 scale-125" 
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 z-20 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 z-20 group"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
      </button>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 animate-fade-in">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  )
}
