"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Edit, Trash2, Search, Upload } from "lucide-react"
import { ref, set, get, remove, push } from "firebase/database"
import { realtimeDb } from "@/firebase/config"
import { toast } from "react-hot-toast"

interface Staff {
  id: string
  // Personal Information
  firstName: string
  middleName?: string
  lastName: string
  fullName: string
  gender: "male" | "female" | "other"
  dateOfBirth: string
  age: number
  contactNumber: string
  alternateContactNumber?: string
  emailAddress: string
  address: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  profilePicture?: string

  // Employment Information
  employeeId: string
  role: string
  department: string
  dateOfJoining: string
  employmentType: "full-time" | "part-time" | "contract"
  shiftTiming: string
  salary: number
  workLocation: string

  // Identity & Verification
  govIdProofType: string
  govIdNumber: string
  govIdDocument?: string
  employeeBadgeNumber?: string

  // System Access
  username?: string
  password?: string
  accessLevel: "admin" | "staff" | "viewer"
  status: "active" | "inactive"

  // Emergency Contact
  emergencyContactName: string
  emergencyContactNumber: string
  relationshipWithEmployee: string
  bloodGroup?: string
  medicalConditions?: string

  createdAt: string
  updatedAt: string
}

const roles = [
  "Developer",
  "Debugger",
  "Software Engineer",
  "Network Engineer",
  "Salesman",
  "Quality Assurance Engineer",
  "Hiring Manager",
  "HR Executive",
  "Accountant",
  "Marketing Executive",
  "Customer Service Representative",
  "Operations Manager",
]

const departments = [
  "HR",
  "Accounts",
  "IT",
  "Sales",
  "Marketing",
  "Operations",
  "Customer Service",
  "Quality Assurance",
]

const govIdTypes = ["Aadhaar", "Passport", "Driving License", "PAN Card", "Voter ID"]

export default function ManageStaff() {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "edit">("list")
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [formData, setFormData] = useState<Partial<Staff>>({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "male",
    dateOfBirth: "",
    contactNumber: "",
    alternateContactNumber: "",
    emailAddress: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "India",
      zipCode: "",
    },
    role: "",
    department: "",
    dateOfJoining: "",
    employmentType: "full-time",
    shiftTiming: "",
    salary: 0,
    workLocation: "",
    govIdProofType: "",
    govIdNumber: "",
    employeeBadgeNumber: "",
    username: "",
    accessLevel: "staff",
    status: "active",
    emergencyContactName: "",
    emergencyContactNumber: "",
    relationshipWithEmployee: "",
    bloodGroup: "",
    medicalConditions: "",
  })

  useEffect(() => {
    fetchStaff()
  }, [])

  useEffect(() => {
    // Auto-calculate age when date of birth changes
    if (formData.dateOfBirth) {
      const today = new Date()
      const birthDate = new Date(formData.dateOfBirth)
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        setFormData((prev) => ({ ...prev, age: age - 1 }))
      } else {
        setFormData((prev) => ({ ...prev, age }))
      }
    }
  }, [formData.dateOfBirth])

  useEffect(() => {
    // Auto-generate full name
    const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(" ")
    setFormData((prev) => ({ ...prev, fullName }))
  }, [formData.firstName, formData.middleName, formData.lastName])

  useEffect(() => {
    // Auto-generate employee ID and username
    if (formData.firstName && formData.lastName) {
      const employeeId = `EMP${Date.now().toString().slice(-6)}`
      const username = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`
      setFormData((prev) => ({
        ...prev,
        employeeId,
        username: prev.username || username,
      }))
    }
  }, [formData.firstName, formData.lastName])

  const fetchStaff = async () => {
    try {
      const staffRef = ref(realtimeDb, "staff")
      const snapshot = await get(staffRef)

      if (snapshot.exists()) {
        const data = snapshot.val()
        const staffList = Object.entries(data).map(([id, staff]: [string, any]) => ({
          id,
          ...staff,
        }))
        setStaff(staffList)
      }
    } catch (error) {
      console.error("Error fetching staff:", error)
      toast.error("Failed to fetch staff")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address!,
          [addressField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.contactNumber ||
      !formData.emailAddress ||
      !formData.role
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const staffRef = ref(realtimeDb, "staff")
      const newStaffRef = push(staffRef)

      const newStaff: Omit<Staff, "id"> = {
        ...(formData as Staff),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await set(newStaffRef, newStaff)

      toast.success("Staff member added successfully!")
      resetForm()
      setActiveTab("list")
      fetchStaff()
    } catch (error) {
      console.error("Error adding staff:", error)
      toast.error("Failed to add staff member")
    }
  }

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStaff) return

    try {
      const staffRef = ref(realtimeDb, `staff/${selectedStaff.id}`)
      const updatedStaff = {
        ...formData,
        updatedAt: new Date().toISOString(),
      }

      await set(staffRef, updatedStaff)

      toast.success("Staff member updated successfully!")
      setActiveTab("list")
      setSelectedStaff(null)
      resetForm()
      fetchStaff()
    } catch (error) {
      console.error("Error updating staff:", error)
      toast.error("Failed to update staff member")
    }
  }

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) {
      return
    }

    try {
      const staffRef = ref(realtimeDb, `staff/${staffId}`)
      await remove(staffRef)

      toast.success("Staff member deleted successfully!")
      fetchStaff()
    } catch (error) {
      console.error("Error deleting staff:", error)
      toast.error("Failed to delete staff member")
    }
  }

  const handleEditStaff = (staffMember: Staff) => {
    setSelectedStaff(staffMember)
    setFormData(staffMember)
    setActiveTab("edit")
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "male",
      dateOfBirth: "",
      contactNumber: "",
      alternateContactNumber: "",
      emailAddress: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "India",
        zipCode: "",
      },
      role: "",
      department: "",
      dateOfJoining: "",
      employmentType: "full-time",
      shiftTiming: "",
      salary: 0,
      workLocation: "",
      govIdProofType: "",
      govIdNumber: "",
      employeeBadgeNumber: "",
      username: "",
      accessLevel: "staff",
      status: "active",
      emergencyContactName: "",
      emergencyContactNumber: "",
      relationshipWithEmployee: "",
      bloodGroup: "",
      medicalConditions: "",
    })
  }

  const filteredStaff = staff.filter(
    (member) =>
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4">
        <Button
          variant={activeTab === "list" ? "default" : "outline"}
          onClick={() => {
            setActiveTab("list")
            resetForm()
            setSelectedStaff(null)
          }}
          className={
            activeTab === "list" ? "bg-red-500 hover:bg-red-600" : "border-gray-200 text-gray-700 hover:bg-gray-50"
          }
        >
          <Users className="h-4 w-4 mr-2" />
          Staff List
        </Button>
        <Button
          variant={activeTab === "add" ? "default" : "outline"}
          onClick={() => {
            setActiveTab("add")
            resetForm()
            setSelectedStaff(null)
          }}
          className={
            activeTab === "add" ? "bg-red-500 hover:bg-red-600" : "border-gray-200 text-gray-700 hover:bg-gray-50"
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>

      {/* Content */}
      {activeTab === "list" ? (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-black flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Members ({filteredStaff.length})
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredStaff.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No staff members found</p>
                <Button onClick={() => setActiveTab("add")} className="mt-4 bg-red-500 hover:bg-red-600 text-white">
                  Add First Staff Member
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Employee</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Role & Department</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Contact</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Employment</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map((member) => (
                      <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium text-black">{member.fullName}</p>
                            <p className="text-sm text-gray-600">{member.employeeId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div>
                            <p className="text-sm text-black">{member.role}</p>
                            <p className="text-sm text-gray-600">{member.department}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div>
                            <p className="text-sm text-black">{member.contactNumber}</p>
                            <p className="text-sm text-gray-600">{member.emailAddress}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div>
                            <p className="text-sm text-black">{member.employmentType}</p>
                            <p className="text-sm text-gray-600">Joined: {member.dateOfJoining}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <Badge
                            className={`${
                              member.status === "active"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            } border`}
                          >
                            {member.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditStaff(member)}
                              className="border-gray-200 text-gray-700 hover:bg-gray-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteStaff(member.id)}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              {activeTab === "add" ? <Plus className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
              {activeTab === "add" ? "Add New Staff Member" : "Edit Staff Member"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={activeTab === "add" ? handleAddStaff : handleUpdateStaff} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input id="middleName" name="middleName" value={formData.middleName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select onValueChange={(value) => handleSelectChange("gender", value)} value={formData.gender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age (Auto-calculated)</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age || ""}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      type="tel"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternateContactNumber">Alternate Contact Number</Label>
                    <Input
                      id="alternateContactNumber"
                      name="alternateContactNumber"
                      type="tel"
                      value={formData.alternateContactNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address *</Label>
                  <Input
                    id="emailAddress"
                    name="emailAddress"
                    type="email"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h4 className="font-medium text-black">Address</h4>
                  <div className="space-y-2">
                    <Label htmlFor="address.street">Street Address</Label>
                    <Input
                      id="address.street"
                      name="address.street"
                      value={formData.address?.street}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address.city">City</Label>
                      <Input
                        id="address.city"
                        name="address.city"
                        value={formData.address?.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address.state">State</Label>
                      <Input
                        id="address.state"
                        name="address.state"
                        value={formData.address?.state}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address.country">Country</Label>
                      <Input
                        id="address.country"
                        name="address.country"
                        value={formData.address?.country}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address.zipCode">Zip Code</Label>
                      <Input
                        id="address.zipCode"
                        name="address.zipCode"
                        value={formData.address?.zipCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Picture */}
                <div className="space-y-2">
                  <Label htmlFor="profilePicture">Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <Input id="profilePicture" type="file" accept="image/*" className="flex-1" />
                    <Button type="button" variant="outline" className="border-gray-200 bg-transparent">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
                  Employment Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID (Auto-generated)</Label>
                    <Input
                      id="employeeId"
                      name="employeeId"
                      value={formData.employeeId}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeBadgeNumber">Employee Badge Number</Label>
                    <Input
                      id="employeeBadgeNumber"
                      name="employeeBadgeNumber"
                      value={formData.employeeBadgeNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role / Designation *</Label>
                    <Select onValueChange={(value) => handleSelectChange("role", value)} value={formData.role}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("department", value)}
                      value={formData.department}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfJoining">Date of Joining *</Label>
                    <Input
                      id="dateOfJoining"
                      name="dateOfJoining"
                      type="date"
                      value={formData.dateOfJoining}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employmentType">Employment Type *</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("employmentType", value)}
                      value={formData.employmentType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shiftTiming">Shift Timing</Label>
                    <Input
                      id="shiftTiming"
                      name="shiftTiming"
                      value={formData.shiftTiming}
                      onChange={handleInputChange}
                      placeholder="e.g., 9:00 AM - 6:00 PM"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary / Hourly Rate (₹)</Label>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      value={formData.salary}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workLocation">Work Location / Branch</Label>
                    <Input
                      id="workLocation"
                      name="workLocation"
                      value={formData.workLocation}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Identity & Verification */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
                  Identity & Verification
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="govIdProofType">Government ID Proof Type</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("govIdProofType", value)}
                      value={formData.govIdProofType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID proof type" />
                      </SelectTrigger>
                      <SelectContent>
                        {govIdTypes.map((idType) => (
                          <SelectItem key={idType} value={idType}>
                            {idType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="govIdNumber">Government ID Number</Label>
                    <Input
                      id="govIdNumber"
                      name="govIdNumber"
                      value={formData.govIdNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="govIdDocument">Upload ID Proof Document</Label>
                  <div className="flex items-center gap-4">
                    <Input id="govIdDocument" type="file" accept=".pdf,.jpg,.jpeg,.png" className="flex-1" />
                    <Button type="button" variant="outline" className="border-gray-200 bg-transparent">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>

              {/* System Access */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">System Access</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" value={formData.username} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accessLevel">Role-based Access Level</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("accessLevel", value)}
                      value={formData.accessLevel}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select onValueChange={(value) => handleSelectChange("status", value)} value={formData.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">Emergency Contact</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactNumber">Emergency Contact Number</Label>
                    <Input
                      id="emergencyContactNumber"
                      name="emergencyContactNumber"
                      type="tel"
                      value={formData.emergencyContactNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationshipWithEmployee">Relationship with Employee</Label>
                    <Input
                      id="relationshipWithEmployee"
                      name="relationshipWithEmployee"
                      value={formData.relationshipWithEmployee}
                      onChange={handleInputChange}
                      placeholder="e.g., Father, Mother, Spouse"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group (Optional)</Label>
                    <Input
                      id="bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      placeholder="e.g., A+, B-, O+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicalConditions">Medical Conditions (Optional)</Label>
                    <Input
                      id="medicalConditions"
                      name="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={handleInputChange}
                      placeholder="Any medical conditions or allergies"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">
                  {activeTab === "add" ? (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Staff Member
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Staff Member
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActiveTab("list")
                    resetForm()
                    setSelectedStaff(null)
                  }}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
