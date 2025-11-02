"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Car, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { signOut } from "firebase/auth"
import { auth } from "@/firebase/config"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import BookingsTable from "./bookings-table"
import ContactDetails from "@/components/admin/contact-details"
import { motion, AnimatePresence } from "framer-motion"

// ✅ Correct import & type for analytics component
import RealtimeBookingsAnalytics from "@/components/admin/realtime-bookings-analytics"

// ✅ Define prop interface so TS knows the component accepts `showAmount`
type RealtimeBookingsAnalyticsProps = {
  showAmount?: boolean
}

// ✅ Type-cast the imported component to include the props
const RealtimeBookingsAnalyticsTyped =
  RealtimeBookingsAnalytics as React.ComponentType<RealtimeBookingsAnalyticsProps>

export default function AdminDashboard() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("realtime-analytics")

  // ✅ Logout handler
  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success("Signed out successfully")
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } catch (error) {
      toast.error("Failed to sign out")
    }
  }

  const sidebarItems = [
    { id: "realtime-analytics", icon: Car, label: "Realtime Analytics", active: activeSection === "realtime-analytics" },
    { id: "booked-cars", icon: Car, label: "Booked Cars", active: activeSection === "booked-cars" },
    { id: "contact-details", icon: Car, label: "Contact Details", active: activeSection === "contact-details" },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "realtime-analytics":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Realtime Analytics
              </h2>
              <p className="text-sm text-gray-500">Live bookings — updated automatically</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* ✅ Type-safe component call */}
              <RealtimeBookingsAnalyticsTyped showAmount={false} />
            </div>
          </div>
        )

      case "booked-cars":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Booked Cars</h2>
            </div>
            <BookingsTable />
          </div>
        )

      case "contact-details":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Contact Details</h2>
              <p className="text-sm text-gray-500">Guest & signed-in user messages</p>
            </div>
            <ContactDetails />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white text-gray-900">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-100 z-50 transform transition-transform duration-300 ease-in-out shadow-lg ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-lg flex items-center justify-center shadow">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold">Admin Panel</div>
              <div className="text-xs text-gray-500">Control center</div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-gray-600 hover:text-black"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="px-4 py-5 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-150 ${
                  item.active
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`p-2 rounded-md flex items-center justify-center ${
                    item.active ? "bg-white/20" : "bg-red-50"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${item.active ? "text-white" : "text-red-600"}`} />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="mb-3 text-xs text-gray-500">Signed in as</div>
          <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-white font-semibold">
                {userProfile?.fullName?.charAt(0) || "A"}
              </div>
              <div>
                <div className="text-sm font-medium">{userProfile?.fullName || "Admin"}</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
            </div>

            <Button variant="ghost" onClick={handleSignOut} className="text-gray-700 hover:bg-red-50">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-72 transition-all duration-200">
        <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                <Menu className="h-5 w-5 text-gray-700" />
              </Button>
              <div className="hidden md:block">
                <div className="text-base font-semibold">Dashboard</div>
                <div className="text-xs text-gray-500">Overview & Realtime insights</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{userProfile?.fullName || "Admin"}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-white font-semibold">
                  {userProfile?.fullName?.charAt(0) || "A"}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
