"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Linkedin, Twitter, Github, Mail } from "lucide-react"

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "/images/ceo.png",
    bio: "Visionary leader with 15+ years in tech innovation",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "sarah@company.com",
    },
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "/images/cto.png",
    bio: "Technical architect driving our innovation forward",
    social: {
      linkedin: "#",
      github: "#",
      email: "michael@company.com",
    },
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Sales",
    image: "/images/headofthesales.png",
    bio: "Sales expert driving business growth and client relationships",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "emily@company.com",
    },
  },
  {
    name: "David Kim",
    role: "Marketing Director",
    image: "/images/marketing-director.png",
    bio: "Strategic marketer connecting brands with audiences",
    social: {
      linkedin: "#",
      github: "#",
      email: "david@company.com",
    },
  },
  {
    name: "Lisa Thompson",
    role: "CEO & Founder",
    image: "/images/ceo.png",
    bio: "Visionary leader with expertise in business strategy",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "lisa@company.com",
    },
  },
  {
    name: "Alex Rivera",
    role: "CTO",
    image: "/images/cto.png",
    bio: "Technology expert building innovative solutions",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "alex@company.com",
    },
  },
]

export default function TeamGrid() {
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
            Meet Our <span className="text-red-600">Amazing Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The passionate individuals behind our success, each bringing unique expertise and dedication to every
            project.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-red-100/50 hover:border-red-200">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Social Links Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-3">
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a
                          href={member.social.twitter}
                          className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {member.social.github && (
                        <a
                          href={member.social.github}
                          className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {member.social.email && (
                        <a
                          href={`mailto:${member.social.email}`}
                          className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                    {member.name}
                  </h3>

                  <p className="text-red-600 font-semibold mb-4 text-lg">{member.role}</p>

                  <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
