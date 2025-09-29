"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Users,
  Car,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  CheckCircle,
  Building2,
  Plus,
  UserCog,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { signOut } from "firebase/auth"
import { auth } from "@/firebase/config"
import { toast } from "react-hot-toast"
// import { useRouter } from "next/navigation"
import KpiCard from "./kpi-card"
import EarningsChart from "./earnings-chart"
import BookingsChart from "./bookings-chart"
import BookingsTable from "./bookings-table"
import CarTypesWidget from "./car-types-widget"
import RentStatusWidget from "./rent-status-widget"
import NotificationsWidget from "./notification-widget"
import DataManagementDropdown from "./data-management-dropdown"
import ManageStaff from "./manage-staff"
import RealtimeCarAnalytics from "@/components/admin/realtime-car-analytics"
import RealtimeBookingsAnalytics from "@/components/admin/realtime-bookings-analytics"

export default function AdminDashboard() {
  const { user, userProfile } = useAuth()
  // const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success("Signed out successfully")
      //router.push("/") // Redirect to home page instead of signin
    } catch (error) {
      toast.error("Failed to sign out")
    }
  }

  const sidebarItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard Overview", active: activeSection === "dashboard" },
    {
      id: "realtime-analytics",
      icon: Car,
      label: "Realtime Analytics",
      active: activeSection === "realtime-analytics",
    },
    { id: "booked-cars", icon: Car, label: "Booked Cars", active: activeSection === "booked-cars" },
    { id: "notifications", icon: Bell, label: "Notifications", active: activeSection === "notifications" },
    { id: "data-management", icon: Settings, label: "Data Management", active: activeSection === "data-management" },
    { id: "manage-staff", icon: UserCog, label: "Manage Staff", active: activeSection === "manage-staff" },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard title="156" subtitle="Total Cars" change="+12%" trend="up" icon={Car} color="red" />
              <KpiCard title="89" subtitle="Total Booked Cars" change="+8%" trend="up" icon={CheckCircle} color="red" />
              <KpiCard title="24" subtitle="Total Employees" change="+3%" trend="up" icon={Users} color="red" />
              <KpiCard title="8" subtitle="Total Showrooms" change="+1%" trend="up" icon={Building2} color="red" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EarningsChart />
              <BookingsChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RentStatusWidget />
              </div>
              <CarTypesWidget />
            </div>
          </div>
        )
      case "realtime-analytics":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">Realtime Analytics</h2>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-black mb-4">Car Performance Analytics</h3>
                <RealtimeCarAnalytics />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-4">Booking Analytics</h3>
                <RealtimeBookingsAnalytics />
              </div>
            </div>
          </div>
        )
      case "booked-cars":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">Booked Cars</h2>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
            <BookingsTable />
          </div>
        )
      case "notifications":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">Notifications</h2>
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 bg-transparent">
                Mark All Read
              </Button>
            </div>
            <NotificationsWidget />
          </div>
        )
      case "data-management":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">Data Management</h2>
            </div>
            <DataManagementDropdown />
          </div>
        )
      case "manage-staff":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">Staff Management</h2>
            </div>
            <ManageStaff />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white text-black">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 shadow-lg`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">Admin Panel</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-gray-600 hover:text-black"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors ${
                item.active ? "bg-red-500 text-white shadow-md" : "text-gray-700 hover:text-black hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:text-black hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        <main className="p-6 bg-gray-50 min-h-screen">
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-black"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-black">
                {sidebarItems.find((item) => item.id === activeSection)?.label || "Dashboard"}
              </h1>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-black">{userProfile?.fullName || "Admin"}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">{userProfile?.fullName?.charAt(0) || "A"}</span>
                </div>
              </div>
            </div>
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  )
}
