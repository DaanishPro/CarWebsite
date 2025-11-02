import HeroSlider from "@/components/HeroSlider"
import AboutSection from "@/components/AboutSection"
import HomeFeatureSection from "@/components/HomeFeatureSection"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "YeloCar - Premium Car Marketplace | Buy & Sell Cars Online",
  description: "Discover the best cars for sale on YeloCar. Buy and sell vehicles with confidence. Premium marketplace with verified listings and secure transactions.",
  keywords: "car marketplace, buy cars online, sell cars, used cars, new cars, automotive marketplace, car dealership",
  authors: [{ name: "YeloCar Team" }],
  creator: "YeloCar",
  publisher: "YeloCar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://yelocar.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "YeloCar - Premium Car Marketplace",
    description: "Discover the best cars for sale on YeloCar. Buy and sell vehicles with confidence.",
    url: "https://yelocar.com",
    siteName: "YeloCar",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "YeloCar - Premium Car Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YeloCar - Premium Car Marketplace",
    description: "Discover the best cars for sale on YeloCar. Buy and sell vehicles with confidence.",
    images: ["/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen scroll-smooth">
      {/* Navbar is rendered in app/layout.tsx */}
      <HeroSlider />
      <HomeFeatureSection />
      <AboutSection />
      {/* Footer and Toaster are rendered in app/layout.tsx */}
    </div>
  )
}