"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { databaseUtils } from "@/lib/firebase"
import { toast } from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"

export default function ContactForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!user) {
        toast.error("Please sign in to send a message.")
        return
      }

      const messageData = {
        FullName: formData.name,
        Contactno: formData.phone,
        Email: formData.email,
        Message: formData.message,
        createdAt: new Date().toISOString(),
      }

      const success = await databaseUtils.saveContactMessage(user.uid, messageData)

      if (success) {
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
        })
        toast.success("Message sent successfully! We'll get back to you soon.")
      }
    } catch (error) {
      console.error("Error submitting form: ", error)
      toast.error("Failed to send your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-100"></div>
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-red-800 mb-6">
              Get in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">Touch</span>
            </h2>
            <p className="text-xl text-red-700 max-w-2xl mx-auto leading-relaxed">
              Have questions or looking for a specific car? Fill out the form below and our expert team will get back to
              you within 24 hours.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-red-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-500 p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Let's Start a Conversation</h3>
              <p className="text-red-100">We're here to help you find your perfect car</p>
            </div>

            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-red-700">Full Name</label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-12 border-red-300 focus:border-red-500 focus:ring-red-500/20 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-red-700">Contact Number</label>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="h-12 border-red-300 focus:border-red-500 focus:ring-red-500/20 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-red-700">Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-12 border-red-300 focus:border-red-500 focus:ring-red-500/20 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-red-700">Message</label>
                  <Textarea
                    name="message"
                    placeholder="Tell us about your car preferences, budget, or any specific questions you have..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="border-red-300 focus:border-red-500 focus:ring-red-500/20 rounded-xl resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending Message...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Send Message
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-red-200">
                <div className="flex items-center justify-center gap-8 text-sm text-red-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    24/7 Support
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Quick Response
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Expert Advice
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
