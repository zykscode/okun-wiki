"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface Community {
  id: string
  name: string
  description: string | null
  region: string | null
  whatsappLink: string | null
  telegramLink: string | null
  _count: {
    members: number
    articles: number
  }
}

interface CommunityDirectoryProps {
  showJoinButton?: boolean
}

export function CommunityDirectory({ showJoinButton = false }: CommunityDirectoryProps) {
  const { data: session } = useSession()
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [joiningCommunity, setJoiningCommunity] = useState<string | null>(null)
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Moved fetchCommunities inside useEffect to avoid exhaustive-deps warning
    const fetchCommunities = async () => {
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.append("query", searchQuery)
        if (selectedRegion && selectedRegion !== "all") params.append("region", selectedRegion)

        const response = await fetch(`/api/communities?${params}`)
        if (response.ok) {
          const data = await response.json()
          setCommunities(data)
        }
      } catch (error) {
        console.error("Error fetching communities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCommunities()
  }, [searchQuery, selectedRegion])

  const handleJoinCommunity = async (communityId: string) => {
    if (!session) return

    setJoiningCommunity(communityId)
    try {
      const response = await fetch(`/api/communities/${communityId}/join`, {
        method: "POST",
      })

      if (response.ok) {
        // Optimistic update: increment member count, mark as joined
        setCommunities((prev) =>
          prev.map((c) =>
            c.id === communityId
              ? { ...c, _count: { ...c._count, members: c._count.members + 1 } }
              : c
          )
        )
        setJoinedIds((prev) => new Set(prev).add(communityId))
      } else {
        const error = await response.json()
        console.error("Error joining community:", error)
      }
    } catch (error) {
      console.error("Error joining community:", error)
    } finally {
      setJoiningCommunity(null)
    }
  }

  const regions = Array.from(
    new Set(communities.map((c) => c.region).filter(Boolean))
  ).sort() as string[]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue placeholder="All regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {communities.map((community) => (
          <div key={community.id} className="glass-card flex flex-col group p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold">
                <Link 
                  href={`/communities/${community.id}`}
                  className="font-display text-wiki-text group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors no-underline"
                >
                  {community.name}
                </Link>
              </h3>
              {community.region && (
                <p className="text-sm font-medium text-forest-600/80 dark:text-forest-400/80 mt-1">
                  {community.region}
                </p>
              )}
              </div>
            <div className="flex-1 flex flex-col">
              {community.description && (
                <p className="text-sm text-wiki-secondary leading-relaxed mb-4 line-clamp-3">
                  {community.description}
                </p>
              )}
              
              <div className="flex justify-between items-center text-xs font-medium text-wiki-muted mb-4 border-t border-wiki-border/50 pt-4 mt-auto">
                <span>{community._count.members} members</span>
                <span>{community._count.articles} articles</span>
              </div>

              {(community.whatsappLink || community.telegramLink) && (
                <div className="flex gap-2 mb-4">
                  {community.whatsappLink && (
                    <a href={community.whatsappLink} target="_blank" rel="noreferrer" className="text-xs bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 px-2 py-1 rounded-md font-medium hover:bg-green-200 transition-colors">
                      WhatsApp Group
                    </a>
                  )}
                  {community.telegramLink && (
                    <a href={community.telegramLink} target="_blank" rel="noreferrer" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 px-2 py-1 rounded-md font-medium hover:bg-blue-200 transition-colors">
                      Telegram Group
                    </a>
                  )}
                </div>
              )}

              {showJoinButton && session && !joinedIds.has(community.id) && (
                <Button
                  onClick={() => handleJoinCommunity(community.id)}
                  disabled={joiningCommunity === community.id}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  {joiningCommunity === community.id ? "Joining..." : "Join Community"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {communities.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No communities found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}