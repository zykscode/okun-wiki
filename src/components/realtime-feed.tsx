"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UpdateAuthor {
  id: string
  name: string | null
  image: string | null
}

interface CommunityUpdate {
  id: string
  content: string
  createdAt: string
  isSOS?: boolean
  author: UpdateAuthor
}

interface RealtimeFeedProps {
  communityId: string
  initialUpdates: CommunityUpdate[]
}

export function RealtimeFeed({ communityId, initialUpdates }: RealtimeFeedProps) {
  const { data: session } = useSession()
  const [updates, setUpdates] = useState<CommunityUpdate[]>(initialUpdates || [])
  const [content, setContent] = useState("")
  const [isSOS, setIsSOS] = useState(false)
  const [posting, setPosting] = useState(false)

  // Polling for updates to simulate real-time feature requested by user without migrating to Supabase
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch(`/api/communities/${communityId}/updates`)
        if (response.ok) {
          const data = await response.json()
          setUpdates(data)
        }
      } catch (error) {
        console.error("Error fetching updates:", error)
      }
    }

    const intervalId = setInterval(fetchUpdates, 10000) // Poll every 10 seconds

    return () => clearInterval(intervalId)
  }, [communityId])

  const handlePost = async () => {
    if (!content.trim() || !session) return
    
    setPosting(true)
    try {
      const response = await fetch(`/api/communities/${communityId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, isSOS })
      })

      if (response.ok) {
        const newUpdate = await response.json()
        setUpdates(prev => {
           // Basic optimistic sort: SOS on top
           const all = [newUpdate, ...prev]
           return all.sort((a, b) => {
             if (a.isSOS && !b.isSOS) return -1;
             if (!a.isSOS && b.isSOS) return 1;
             return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
           });
        })
        setContent("")
        setIsSOS(false)
      }
    } catch (error) {
      console.error("Error posting update:", error)
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Community Feed</h2>
        <span className="flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </div>

      {session && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src={session.user?.image || undefined} />
                <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <Input
                  placeholder="Share a real-time update with your community..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handlePost()
                    }
                  }}
                />
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isSOS}
                      onChange={(e) => setIsSOS(e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-red-600">Mark as S.O.S Emergency</span>
                  </label>
                  <Button 
                    onClick={handlePost} 
                    disabled={!content.trim() || posting}
                    variant={isSOS ? "destructive" : "default"}
                  >
                    {posting ? "Posting..." : isSOS ? "Send S.O.S" : "Post Update"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {updates.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No updates yet. Be the first to post!</p>
        ) : (
          updates.map((update) => (
            <Card key={update.id} className={update.isSOS ? "border-red-500 bg-red-50 dark:bg-red-950 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse-border relative overflow-hidden" : ""}>
              {update.isSOS && (
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
              )}
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={update.author.image || undefined} />
                    <AvatarFallback>{update.author.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold">{update.author.name || 'Anonymous'}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(update.createdAt).toLocaleDateString()}
                      </span>
                      {update.isSOS && (
                        <span className="text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded-full ml-2 uppercase animate-pulse">S.O.S</span>
                      )}
                    </div>
                    <p className={`whitespace-pre-wrap ${update.isSOS ? 'text-red-900 dark:text-red-100 font-medium' : 'text-gray-800'}`}>{update.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
