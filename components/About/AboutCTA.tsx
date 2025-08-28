"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function AboutCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-10" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600/50 to-red-900/50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Start Your <span className="text-red-200">Journey?</span>
          </h2>

          <p className="text-xl md:text-2xl text-red-100 mb-12 leading-relaxed">
            Let's work together to transform your ideas into extraordinary digital experiences that drive real results.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center items-center"
          >
            <Link href="/contact">
              <button className="group bg-white text-red-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-red-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3">
                <MessageCircle className="w-6 h-6" />
                <span>Get In Touch</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-red-200"
          >
            <p className="text-lg">Join 10,000+ satisfied clients who trust us with their digital transformation</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
