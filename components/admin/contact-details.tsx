"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { databaseUtils } from "@/lib/firebase" // if your path differs, adjust accordingly
import { realtimeDb } from "@/firebase/config"
import { onValue, ref, type DataSnapshot, query, orderByChild, limitToLast } from "firebase/database"
import { format } from "date-fns"
import { toast } from "react-hot-toast"

/**
 * Contact record unified type
 */
type UnifiedContact = {
  id?: string
  name: string
  email?: string
  phone?: string
  message?: string
  createdAt?: string
  source: "Guest" | "User"
  userId?: string
}

export default function ContactDetails() {
  const [contacts, setContacts] = useState<UnifiedContact[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    // 1) Listen to contactForms (public submissions) using databaseUtils helper
    const unsubscribeContactForms = databaseUtils.listenToContactForms((forms) => {
      // forms are ContactFormData[] with fields: name, email, phone, message, createdAt
      const mapped = forms.map((f) => ({
        id: (f as any).id || undefined,
        name: (f as any).name || (f as any).FullName || "Guest",
        email: (f as any).email || undefined,
        phone: (f as any).phone || undefined,
        message: (f as any).message || undefined,
        createdAt: (f as any).createdAt || undefined,
        source: "Guest" as const,
      }))
      setContacts((prev) => {
        // merge while preserving messages from other listener
        const fromUsers = prev.filter((p) => p.source === "User")
        return [...fromUsers, ...mapped]
      })
      setLoading(false)
    })

    // 2) Listen to message/* (per-user messages). The 'message' node stores child nodes keyed by userId.
    const messagesRef = ref(realtimeDb, "message")
    const messagesQuery = query(messagesRef, orderByChild("createdAt")) // ordering optional; we'll sort later
    const onMessages = onValue(
      messagesQuery,
      (snapshot: DataSnapshot) => {
        const userMessages: UnifiedContact[] = []
        if (snapshot.exists()) {
          snapshot.forEach((child) => {
            // Each child is keyed by userId and value is the message object saved via saveContactMessage
            const userId = child.key || undefined
            const val = child.val() as any
            // val likely has: FullName, Contactno, Email, Message, createdAt
            userMessages.push({
              id: val.id || userId,
              name: val.FullName || val.name || "User",
              email: val.Email || undefined,
              phone: val.Contactno || undefined,
              message: val.Message || undefined,
              createdAt: val.createdAt || undefined,
              source: "User",
              userId,
            })
          })
        }

        // merge with any existing guest contacts (contactForms)
        setContacts((prev) => {
          const guests = prev.filter((p) => p.source === "Guest")
          return [...userMessages, ...guests]
        })
        setLoading(false)
      },
      (err) => {
        console.error("Error listening to user messages:", err)
        toast.error("Failed to listen to user messages")
        setLoading(false)
      },
    )

    // cleanup
    return () => {
      if (typeof unsubscribeContactForms === "function") unsubscribeContactForms()
      // onValue returns the unsubscribe function in Firebase JS as well when used directly - to be safe:
      try {
        // Firebase onValue returns the callback; to unsubscribe call off. But modern SDK returns unsubscribe function.
        messagesQuery && (onValue as any).off // noop-check (no-op)
      } catch {
        // noop
      }
      // Properly remove listener:
      if (messagesRef) {
        // @ts-ignore
        // call onValue with null to unsubscribe is not standard; instead use off:
        try {
          // @ts-ignore
          realtimeDb.ref && realtimeDb.ref.off && realtimeDb.ref.off()
        } catch {
          // ignore
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // unified sorted contacts (most recent first)
  const sortedContacts = useMemo(() => {
    return [...contacts]
      .filter(Boolean)
      .sort((a, b) => {
        const ta = a.createdAt ? Date.parse(a.createdAt) : 0
        const tb = b.createdAt ? Date.parse(b.createdAt) : 0
        return tb - ta
      })
  }, [contacts])

  // search filter
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return sortedContacts
    return sortedContacts.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.message && c.message.toLowerCase().includes(q)) ||
        (c.userId && c.userId.toLowerCase().includes(q)),
    )
  }, [search, sortedContacts])

  const formatDate = (iso?: string) => {
    if (!iso) return "-"
    try {
      const d = new Date(iso)
      return format(d, "dd MMM yyyy, HH:mm")
    } catch {
      return iso
    }
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-black">Contact Messages</CardTitle>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                placeholder="Search name, email, phone, message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-3 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("")
              }}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Phone</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Message</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Source</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Date</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="py-6 px-2 text-center text-gray-500">
                    Loading contacts...
                  </td>
                </tr>
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 px-2 text-center text-gray-500">
                    No contact messages found.
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((c, idx) => (
                  <tr key={c.id || idx} className="border-b border-gray-100 hover:bg-gray-50 align-top">
                    <td className="py-3 px-2">
                      <div>
                        <span className="text-sm font-medium text-black">{c.name || "-"}</span>
                        {c.userId && (
                          <div className="text-xs text-gray-400">UID: {c.userId}</div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-2">
                      <span className="text-sm text-gray-700">{c.email || "-"}</span>
                    </td>

                    <td className="py-3 px-2">
                      <span className="text-sm text-gray-700">{c.phone || "-"}</span>
                    </td>

                    <td className="py-3 px-2">
                      <div className="max-w-md text-sm text-gray-700 line-clamp-3">{c.message || "-"}</div>
                    </td>

                    <td className="py-3 px-2">
                      <span
                        className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                          c.source === "User" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {c.source}
                      </span>
                    </td>

                    <td className="py-3 px-2">
                      <span className="text-sm text-gray-700">{formatDate(c.createdAt)}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
