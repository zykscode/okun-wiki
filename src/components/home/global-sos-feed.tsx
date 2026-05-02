"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface SosUpdate {
  id: string
  content: string
  createdAt: string
  community: {
    name: string
    slug: string
  }
}

export function GlobalSosFeed() {
  const [updates, setUpdates] = useState<SosUpdate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch('/api/updates/sos')
        if (response.ok) {
          const data = await response.json()
          setUpdates(data)
        }
      } catch (error) {
        console.error("Error fetching SOS updates:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUpdates()
    const intervalId = setInterval(fetchUpdates, 30000) // Poll every 30 seconds

    return () => clearInterval(intervalId)
  }, [])

  if (loading) {
    return (
      <div className="max-w-md mx-auto rounded-2xl bg-neutral-900/50 backdrop-blur-xl border border-red-500/30 p-5 text-left shadow-[0_0_40px_rgba(239,68,68,0.1)]">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-red-500/20 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-neutral-700 rounded"></div>
              <div className="h-4 bg-neutral-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (updates.length === 0) {
    return (
      <div className="max-w-md mx-auto rounded-2xl bg-neutral-900/50 backdrop-blur-xl border border-green-500/30 p-5 text-left shadow-[0_0_40px_rgba(34,197,94,0.1)]">
        <div className="flex items-center gap-3 mb-2">
          <span className="relative flex h-3 w-3">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-green-400 font-bold text-sm tracking-widest uppercase">All Clear</span>
        </div>
        <p className="text-neutral-300 text-sm">There are currently no active emergency or S.O.S reports in Okun land.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {updates.map((update) => (
        <div key={update.id} className="rounded-2xl bg-neutral-900/80 backdrop-blur-xl border border-red-500/50 p-5 text-left shadow-[0_0_40px_rgba(239,68,68,0.15)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
          <div className="flex items-center gap-3 mb-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-red-400 font-bold text-sm tracking-widest uppercase">Verified Alert</span>
            <span className="text-neutral-500 text-xs ml-auto">
               {new Date(update.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="text-white font-medium mb-2">{update.content}</p>
          <Link href={`/communities/${update.community.slug}`} className="text-neutral-400 text-xs hover:text-white transition-colors flex items-center gap-1">
             Reported in {update.community.name} &rarr;
          </Link>
        </div>
      ))}
    </div>
  )
}
