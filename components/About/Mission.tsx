"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Target, Heart, Lightbulb, Rocket } from "lucide-react"

const missions = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To empower businesses with innovative solutions that drive growth, efficiency, and success in the digital age.",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Heart,
    title: "Our Values",
    description: "We believe in integrity, innovation, and putting our clients first in everything we do.",
    color: "from-red-600 to-red-700",
  },
  {
    icon: Lightbulb,
    title: "Our Vision",
    description:
      "To be the leading force in digital transformation, creating a future where technology serves humanity.",
    color: "from-red-700 to-red-800",
  },
  {
    icon: Rocket,
    title: "Our Goal",
    description: "To continuously push boundaries and deliver exceptional results that exceed expectations.",
    color: "from-red-800 to-red-900",
  },
]

export default function Mission() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-gray-50 to-red-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-300/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Drives <span className="text-red-600">Us Forward</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our core principles and aspirations that guide every decision we make and every solution we create.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {missions.map((mission, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-red-100/50 hover:border-red-200">
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${mission.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <mission.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-300">
                  {mission.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-lg">{mission.description}</p>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
