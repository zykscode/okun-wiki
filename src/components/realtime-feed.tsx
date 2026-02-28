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
        body: JSON.stringify({ content })
      })

      if (response.ok) {
        const newUpdate = await response.json()
        setUpdates(prev => [newUpdate, ...prev])
        setContent("")
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
                <div className="flex justify-end">
                  <Button 
                    onClick={handlePost} 
                    disabled={!content.trim() || posting}
                  >
                    {posting ? "Posting..." : "Post Update"}
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
            <Card key={update.id}>
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
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">{update.content}</p>
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
