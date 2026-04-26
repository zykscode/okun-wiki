"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { acceptMentorship, completeMentorship, cancelMentorship } from "@/lib/actions/mentorship"
import { CheckCircle2, XCircle, Users } from "lucide-react"

type MentorshipItem = {
  id: string
  status: string
  mentorId: string | null
  menteeId: string | null
  community: { name: string }
  mentor?: { name: string | null } | null
  mentee?: { name: string | null } | null
}

export function MentorshipDashboard({ 
  userId, 
  myRequests, 
  activeConnections, 
  availableRequests 
}: { 
  userId: string, 
  myRequests: MentorshipItem[], 
  activeConnections: MentorshipItem[], 
  availableRequests: MentorshipItem[] 
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleAction = async (action: Function, id: string) => {
    setLoadingId(id)
    try {
      await action(id)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-wiki-text mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-wiki-primary" /> Active Connections
        </h2>
        {activeConnections.length === 0 ? (
          <p className="text-wiki-muted text-sm">You have no active mentorship connections.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeConnections.map(m => {
              const isMentor = m.mentorId === userId
              const otherPersonName = isMentor ? m.mentee?.name : m.mentor?.name
              
              return (
                <Card key={m.id} className="border-green-500/30 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">ACTIVE</Badge>
                      <span className="text-xs text-wiki-muted">{m.community.name}</span>
                    </div>
                    <p className="font-semibold text-lg">{otherPersonName || "Anonymous"}</p>
                    <p className="text-sm text-wiki-secondary mb-4">
                      {isMentor ? "You are mentoring them." : "They are your mentor."}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-wiki-muted"
                      onClick={() => handleAction(completeMentorship, m.id)}
                      disabled={loadingId === m.id}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Completed
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-wiki-text mb-4">My Pending Requests</h3>
          {myRequests.length === 0 ? (
            <p className="text-wiki-muted text-sm">No pending requests.</p>
          ) : (
            <div className="space-y-4">
              {myRequests.map(m => (
                <Card key={m.id}>
                  <CardContent className="pt-6 flex justify-between items-center">
                    <div>
                      <Badge variant="outline" className="mb-2 text-yellow-600 bg-yellow-50 border-yellow-200">PENDING</Badge>
                      <p className="text-sm font-medium">Looking for a {m.menteeId === userId ? "Mentor" : "Mentee"}</p>
                      <p className="text-xs text-wiki-muted">in {m.community.name}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleAction(cancelMentorship, m.id)} disabled={loadingId === m.id}>
                      <XCircle className="w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-wiki-text mb-4">Community Opportunities</h3>
          {availableRequests.length === 0 ? (
            <p className="text-wiki-muted text-sm">No opportunities currently available in your communities.</p>
          ) : (
            <div className="space-y-4">
              {availableRequests.map(m => {
                const lookingFor = m.mentorId ? "Mentee" : "Mentor"
                const requesterName = m.mentorId ? m.mentor?.name : m.mentee?.name
                
                return (
                  <Card key={m.id} className="bg-blue-50/50 border-blue-100">
                    <CardContent className="pt-6">
                      <div className="mb-2">
                        <span className="font-semibold text-wiki-text">{requesterName || "A member"}</span>
                        <span className="text-sm text-wiki-secondary"> is looking for a {lookingFor} in {m.community.name}.</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleAction(acceptMentorship, m.id)}
                        disabled={loadingId === m.id}
                      >
                        Offer to be their {lookingFor}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
