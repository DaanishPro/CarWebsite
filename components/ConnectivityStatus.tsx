"use client"

import { useFirebaseConnectivity } from '@/hooks/useFirebaseConnectivity'
import { Wifi, WifiOff, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ConnectivityStatus() {
  const { isConnected, isLoading } = useFirebaseConnectivity()

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-full shadow-lg"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Checking connection...</span>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-full shadow-lg"
        >
          <WifiOff className="h-4 w-4" />
          <span className="text-sm">Offline - Some features may be limited</span>
        </motion.div>
      )}
      
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-full shadow-lg"
        >
          <Wifi className="h-4 w-4" />
          <span className="text-sm">Connected</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 