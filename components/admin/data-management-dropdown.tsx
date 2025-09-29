"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Building2, Plus, Eye, Edit, BarChart3 } from "lucide-react"
import ManageShowroom from "./manage-showroom"
import AddNewCar from "./add-new-car"
import UpdateCar from "./update-car"
import ViewSales from "./view-sales"

const dataModules = [
  {
    id: "manage-showroom",
    title: "Manage Showroom",
    icon: Building2,
    description: "Manage registered showrooms, add new ones, and delete existing showrooms",
    subModules: ["Registered Showrooms", "Add New Showroom", "Delete Showroom"],
  },
  {
    id: "add-new-car",
    title: "Add New Car",
    icon: Plus,
    description: "Add new cars to the website with images, details, and features",
    subModules: ["Car Form", "Image Upload", "Feature Selection"],
  },
  {
    id: "update-car",
    title: "Update Car",
    icon: Edit,
    description: "View all cars in tabular format and update their details",
    subModules: ["Car List", "Edit Details", "Update Features"],
  },
  {
    id: "view-sales",
    title: "View Sales",
    icon: BarChart3,
    description: "View booked car details with payment information",
    subModules: ["Booking Details", "Payment Status", "Revenue Analytics"],
  },
]

export default function DataManagementDropdown() {
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [expandedModules, setExpandedModules] = useState<string[]>([])

  const toggleModule = (moduleId: string) => {
    if (expandedModules.includes(moduleId)) {
      setExpandedModules(expandedModules.filter((id) => id !== moduleId))
    } else {
      setExpandedModules([...expandedModules, moduleId])
    }
  }

  const renderModuleContent = () => {
    switch (activeModule) {
      case "manage-showroom":
        return <ManageShowroom />
      case "add-new-car":
        return <AddNewCar />
      case "update-car":
        return <UpdateCar />
      case "view-sales":
        return <ViewSales />
      default:
        return null
    }
  }

  if (activeModule) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setActiveModule(null)}
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            ← Back to Modules
          </Button>
          <h3 className="text-xl font-semibold text-black">{dataModules.find((m) => m.id === activeModule)?.title}</h3>
        </div>
        {renderModuleContent()}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {dataModules.map((module) => {
        const isExpanded = expandedModules.includes(module.id)
        const Icon = module.icon

        return (
          <Card key={module.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-black text-lg">{module.title}</CardTitle>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleModule(module.id)}
                  className="text-gray-500 hover:text-black"
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-gray-600 text-sm mb-4">{module.description}</p>

              {isExpanded && (
                <div className="space-y-3">
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Sub-modules:</p>
                    <ul className="space-y-1">
                      {module.subModules.map((subModule, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          {subModule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <Button
                onClick={() => setActiveModule(module.id)}
                className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                Open Module
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
