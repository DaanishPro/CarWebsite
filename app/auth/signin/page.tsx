"use client"

import { Toaster } from "react-hot-toast"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Eye, EyeOff, Mail, Lock, Shield, ArrowRight, Award } from "lucide-react"
import { auth } from "@/firebase/config"
import { signInWithEmailAndPassword } from "firebase/auth"
import { toast } from "react-hot-toast"
import { authUtils } from "@/lib/auth-utils"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const userProfile = await authUtils.getUserProfile(user.uid)

      toast.success("Signed in successfully! Welcome back!")

      // Redirect based on role
      if (userProfile?.role === "admin") {
        router.push("/admin-dashboard")
      } else {
        router.push("/home")
      }
      router.refresh()
    } catch (error: any) {
      console.error("Error signing in:", error)

      let errorMessage = "Sign in failed. Please try again."

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address."
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address."
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later."
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection."
      }

      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
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
              <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
              <CardDescription className="text-gray-300">Sign in to your YeloCar account</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-2 bg-gray-950/60 text-gray-100 placeholder:text-gray-400 border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-2 bg-gray-950/60 text-gray-100 placeholder:text-gray-400 border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 rounded-xl"
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
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Sign In
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-gray-300">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
                  Create Account
                </Link>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
                <Shield className="h-3 w-3 text-red-400" />
                <span>100% Secure Authentication</span>
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
