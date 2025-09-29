"use client"

import { Toaster } from "react-hot-toast"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Eye, EyeOff, User, Phone, Mail, Lock, CheckCircle, Shield, Award } from "lucide-react"
import { auth } from "@/firebase/config"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { toast } from "react-hot-toast"
import { authUtils } from "@/lib/auth-utils"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!fullName.trim()) {
      errors.fullName = "Full name is required"
    } else if (fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters"
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required"
    } else if (!/^[0-9]{10}$/.test(phoneNumber.replace(/\s/g, ""))) {
      errors.phoneNumber = "Please enter a valid 10-digit phone number"
    }

    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const profileCreated = await authUtils.createUserProfile(user, {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        role: "buyer", // Default role for new signups
      })

      if (profileCreated) {
        toast.success("Account created successfully! Welcome to YeloCar!")
        router.push("/home")
        router.refresh()
      } else {
        throw new Error("Failed to create user profile")
      }
    } catch (error: any) {
      console.error("Error signing up:", error)

      let errorMessage = "Sign up failed. Please try again."

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists."
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please choose a stronger password."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address."
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection."
      }

      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearError = (field: string) => {
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border border-white/5 bg-gray-900/70 backdrop-blur-xl rounded-2xl">
          <CardHeader className="text-center space-y-4 pb-6">
            <Link
              href="/home"
              className="flex items-center justify-center gap-3 text-3xl font-bold text-red-500 hover:text-red-400 transition-colors"
            >
              <div className="relative">
                <Car className="h-10 w-10" />
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <span className="text-white">YeloCar</span>
            </Link>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-white">Create Your Account</CardTitle>
              <CardDescription className="text-gray-300">
                Join YeloCar and start your premium automotive journey
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      clearError("fullName")
                    }}
                    className={`pl-10 h-12 border-2 bg-gray-950/60 text-gray-100 placeholder:text-gray-400 transition-all duration-200 ${
                      formErrors.fullName
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-700 focus:border-red-500"
                    } focus:ring-2 focus:ring-red-500/20 rounded-xl`}
                    required
                  />
                </div>
                {formErrors.fullName && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value)
                      clearError("phoneNumber")
                    }}
                    className={`pl-10 h-12 border-2 bg-gray-950/60 text-gray-100 placeholder:text-gray-400 transition-all duration-200 ${
                      formErrors.phoneNumber
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-700 focus:border-red-500"
                    } focus:ring-2 focus:ring-red-500/20 rounded-xl`}
                    required
                  />
                </div>
                {formErrors.phoneNumber && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {formErrors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      clearError("email")
                    }}
                    className={`pl-10 h-12 border-2 bg-gray-950/60 text-gray-100 placeholder:text-gray-400 transition-all duration-200 ${
                      formErrors.email ? "border-red-500 focus:border-red-500" : "border-gray-700 focus:border-red-500"
                    } focus:ring-2 focus:ring-red-500/20 rounded-xl`}
                    required
                  />
                </div>
                {formErrors.email && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      clearError("password")
                    }}
                    className={`pl-10 pr-10 h-12 border-2 bg-gray-950/60 text-gray-100 placeholder:text-gray-400 transition-all duration-200 ${
                      formErrors.password
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-700 focus:border-red-500"
                    } focus:ring-2 focus:ring-red-500/20 rounded-xl`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      clearError("confirmPassword")
                    }}
                    className={`pl-10 pr-10 h-12 border-2 bg-gray-950/60 text-gray-100 placeholder:text-gray-400 transition-all duration-200 ${
                      formErrors.confirmPassword
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-700 focus:border-red-500"
                    } focus:ring-2 focus:ring-red-500/20 rounded-xl`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white font-semibold text-lg rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Create Account
                  </div>
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-gray-300">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
                  Sign In
                </Link>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
                <Shield className="h-3 w-3 text-red-400" />
                <span>100% Secure & Verified</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
                <Award className="h-3 w-3 text-red-400" />
                <span>Premium Automotive Platform</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster position="bottom-right" />
    </div>
  )
}
