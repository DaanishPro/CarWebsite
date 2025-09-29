"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { TrendingUp, Users, Award, Globe } from "lucide-react"

const stats = [
  {
    icon: Users,
    number: "10K+",
    label: "Happy Clients",
    description: "Trusted by businesses worldwide",
  },
  {
    icon: Award,
    number: "50+",
    label: "Awards Won",
    description: "Recognition for excellence",
  },
  {
    icon: TrendingUp,
    number: "99%",
    label: "Success Rate",
    description: "Delivering exceptional results",
  },
  {
    icon: Globe,
    number: "25+",
    label: "Countries",
    description: "Global reach and impact",
  },
]

export default function AboutStats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Impact in <span className="text-red-600">Numbers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            These numbers represent the trust and success we've built together with our amazing community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white to-red-50/30 border border-red-100/50 hover:border-red-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>

              <motion.h3
                initial={{ scale: 0.5 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="text-4xl md:text-5xl font-bold text-red-600 mb-2"
              >
                {stat.number}
              </motion.h3>

              <h4 className="text-xl font-semibold text-gray-900 mb-2">{stat.label}</h4>

              <p className="text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
