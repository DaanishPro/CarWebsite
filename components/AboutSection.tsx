"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Users, Target, Award, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  const features = [
    {
      icon: Users,
      title: "Expert Team",
      description: "Seasoned professionals with decades of combined experience",
    },
    {
      icon: Target,
      title: "Focused Vision",
      description: "Clear objectives and strategic approach to every project",
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Track record of successful deliveries and satisfied clients",
    },
    {
      icon: Zap,
      title: "Innovation First",
      description: "Cutting-edge solutions using the latest technologies",
    },
  ]

  return (
    <section className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-red-50/30 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-100/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.div
              className="inline-block mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-full shadow-lg">
                About Our Company
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transforming Ideas Into
              <span className="block bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                Digital Excellence
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We are a forward-thinking company dedicated to delivering innovative solutions that drive growth and
              create lasting impact for businesses worldwide.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left Content */}
            <motion.div variants={itemVariants as any} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">Building the Future, One Solution at a Time</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Since our inception, we've been at the forefront of technological innovation, helping businesses
                  navigate the digital landscape with confidence and clarity. Our commitment to excellence drives
                  everything we do.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We believe in the power of collaboration, creativity, and cutting-edge technology to solve complex
                  challenges and unlock new opportunities for growth.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 bg-transparent"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div variants={itemVariants as any} className="relative">
              <div className="relative bg-gradient-to-br from-red-500 to-red-700 rounded-3xl p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-transparent rounded-3xl" />
                <div className="relative z-10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-white mb-2">500+</div>
                      <div className="text-red-100 text-sm">Projects Completed</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-white mb-2">98%</div>
                      <div className="text-red-100 text-sm">Client Satisfaction</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-white mb-2">50+</div>
                      <div className="text-red-100 text-sm">Team Members</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                      <div className="text-3xl font-bold text-white mb-2">24/7</div>
                      <div className="text-red-100 text-sm">Support Available</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div variants={itemVariants as any}>
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Us</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-gray-100"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
