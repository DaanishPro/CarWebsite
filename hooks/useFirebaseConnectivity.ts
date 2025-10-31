import { useState, useEffect } from 'react'
import { databaseUtils } from '@/lib/firebase'

export const useFirebaseConnectivity = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Initial connectivity check
    const checkConnectivity = async () => {
      try {
        const connected = await databaseUtils.checkConnectivity()
        setIsConnected(connected)
      } catch (error) {
        console.error('Connectivity check failed:', error)
        setIsConnected(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkConnectivity()

    // Set up real-time connectivity listener
    const unsubscribe = databaseUtils.listenToConnectivity((connected) => {
      setIsConnected(connected)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return { isConnected, isLoading }
} 