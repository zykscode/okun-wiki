"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MentorshipCardProps {
  communityId: string
  mentorRole?: string
  menteeRole?: string
}

export function MentorshipCard({ communityId }: MentorshipCardProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  
  const handleRequestMentorship = async () => {
    if (!session) return

    setLoading(true)
    try {
      // API call to create a pending mentorship
      const response = await fetch(`/api/communities/${communityId}/mentorship`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "MENTEE" })
      })
      if (response.ok) {
        alert("Mentorship request sent!")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <h2 className="text-xl font-bold">Mentorship Program</h2>
        <p className="text-sm text-gray-500">
          Connect with experienced community members to learn, or offer your knowledge to guide emerging members.
        </p>
      </CardHeader>
      <CardContent>
        {session ? (
          <div className="flex gap-4">
             <Button
                disabled={loading}
                onClick={handleRequestMentorship}
             >
                Find a Mentor
             </Button>
             <Button
                disabled={loading}
                // Option for users offering to mentor
                onClick={() => alert("Feature to offer mentorship coming soon!")}
             >
                Offer Mentorship
             </Button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Sign in to join the mentorship program.</p>
        )}
      </CardContent>
    </Card>
  )
}
