"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Calendar, Trophy, Users, Rocket, Star, Globe } from "lucide-react"

const timelineEvents = [
  {
    year: "2018",
    title: "The Beginning",
    description: "Started with a vision to transform digital experiences",
    icon: Rocket,
    color: "from-red-400 to-red-500",
  },
  {
    year: "2019",
    title: "First Major Client",
    description: "Secured our first enterprise client and delivered exceptional results",
    icon: Users,
    color: "from-red-500 to-red-600",
  },
  {
    year: "2020",
    title: "Team Expansion",
    description: "Grew our team to 25+ talented professionals",
    icon: Star,
    color: "from-red-600 to-red-700",
  },
  {
    year: "2021",
    title: "Industry Recognition",
    description: "Won multiple awards for innovation and excellence",
    icon: Trophy,
    color: "from-red-700 to-red-800",
  },
  {
    year: "2022",
    title: "Global Reach",
    description: "Expanded operations to serve clients across 25+ countries",
    icon: Globe,
    color: "from-red-800 to-red-900",
  },
  {
    year: "2024",
    title: "Future Forward",
    description: "Continuing to innovate and lead in digital transformation",
    icon: Calendar,
    color: "from-red-900 to-red-950",
  },
]

export default function Timeline() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-red-50/30" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-red-600">Journey</span> So Far
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From humble beginnings to industry leadership - here's how we've grown and evolved over the years.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-red-200 via-red-400 to-red-600 hidden md:block" />

          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-col md:gap-8 gap-4`}
              >
                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} text-center`}>
                  <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-red-100/50 hover:border-red-200">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${event.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}
                      >
                        <event.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-3xl font-bold text-red-600">{event.year}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                      {event.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">{event.description}</p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="relative z-10 hidden md:block">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                    className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-4 border-white shadow-lg"
                  />
                </div>

                {/* Spacer for opposite side */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
