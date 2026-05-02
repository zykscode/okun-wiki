import { Metadata } from "next";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Handshake, GraduationCap, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Mentorship Dashboard",
  description: "Manage your mentorship requests and connections.",
};

export default async function MentorshipDashboard() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/communities/mentorship");
  }

  // Normally, fetch from prisma. For now we use placeholder structure since we don't have the exact mentorship fields seeded yet.
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-16 md:mt-24 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight bg-gradient-to-br from-wiki-text to-wiki-muted bg-clip-text text-transparent">
          Mentorship Dashboard
        </h1>
        <p className="text-lg text-wiki-muted max-w-2xl mx-auto">
          Manage your mentoring relationships, track goals, and connect with your community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-4 bg-primary-500/10 rounded-full text-primary-500 mb-2">
            <Handshake size={32} />
          </div>
          <h3 className="text-xl font-bold">Active Connections</h3>
          <p className="text-3xl font-display font-bold">0</p>
          <p className="text-sm text-wiki-muted">Currently active mentorships</p>
        </div>
        
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-4 bg-green-500/10 rounded-full text-green-500 mb-2">
            <GraduationCap size={32} />
          </div>
          <h3 className="text-xl font-bold">Pending Requests</h3>
          <p className="text-3xl font-display font-bold">0</p>
          <p className="text-sm text-wiki-muted">Awaiting your approval</p>
        </div>

        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-4 bg-purple-500/10 rounded-full text-purple-500 mb-2">
            <Users size={32} />
          </div>
          <h3 className="text-xl font-bold">Mentorship Tracks</h3>
          <p className="text-3xl font-display font-bold">4</p>
          <p className="text-sm text-wiki-muted">Available disciplines</p>
        </div>
      </div>

      <div className="glass-panel p-8 mt-12 text-center">
        <h3 className="text-2xl font-bold mb-4">No Active Mentorships</h3>
        <p className="text-wiki-muted mb-6">
          You haven't connected with a mentor or mentee yet. Visit a community page to find your match.
        </p>
        <a href="/communities" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors">
          Explore Communities
        </a>
      </div>
    </div>
  );
}
