"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Shield, Zap, Users, Award, Clock, Headphones } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Trusted & Secure",
    description: "Enterprise-grade security with 99.9% uptime guarantee",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance that delivers results in record time",
    color: "from-red-600 to-red-700",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Seasoned professionals with decades of combined experience",
    color: "from-red-700 to-red-800",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized industry leader with multiple accolades",
    color: "from-red-800 to-red-900",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance whenever you need it",
    color: "from-red-500 to-red-700",
  },
  {
    icon: Headphones,
    title: "Customer First",
    description: "Your success is our priority, always",
    color: "from-red-600 to-red-800",
  },
]

export default function WhyChooseUs() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-red-900 via-red-800 to-red-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-5" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-red-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-red-700/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose <span className="text-red-200">Us?</span>
          </h2>
          <p className="text-xl text-red-100 max-w-3xl mx-auto leading-relaxed">
            We combine expertise, innovation, and dedication to deliver exceptional results that drive your business
            forward.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:-translate-y-2 hover:bg-white/15">
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-200 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-red-100 leading-relaxed">{feature.description}</p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-400/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
