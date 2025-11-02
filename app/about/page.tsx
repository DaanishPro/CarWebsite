

import type { Metadata } from "next"
import AboutHero from "@/components/About/AboutHero"
import Mission from "@/components/About/Mission"
import Timeline from "@/components/About/Timeline"
import WhyChooseUs from "@/components/About/WhyChooseUs"
import TeamGrid from "@/components/About/TeamGrid"
import AboutStats from "@/components/About/AboutStats"
import AboutCTA from "@/components/About/AboutCTA"

export const metadata: Metadata = {
  title: "About Us - Our Story & Mission",
  description: "Learn about our journey, mission, and the passionate team behind our success.",
}

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30">
      {/* Hero Section with animated background */}
      <AboutHero />

      {/* Stats Section */}
      <AboutStats />

      {/* Mission Section */}
      <Mission />

      {/* Timeline Section */}
      <Timeline />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Team Section */}
      <TeamGrid />

      {/* Call to Action */}
      <AboutCTA />
    </div>
  )
}
