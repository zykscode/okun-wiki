"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Users } from "lucide-react";
import { MentorshipCard } from "@/components/mentorship-card";
import { RealtimeFeed } from "@/components/realtime-feed";

interface CommunityUpdate {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface CommunityDetails {
  id: string;
  name: string;
  region: string;
  description: string;
  _count: {
    members: number;
    articles: number;
  };
  articles: CommunityUpdate[];
}

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const communityId = params.id as string;

  const [community, setCommunity] = useState<CommunityDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await fetch(`/api/communities/${communityId}`);
        if (response.ok) {
          const data = await response.json();
          setCommunity(data);
        }
      } catch (error) {
        console.error("Failed to fetch community details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (communityId) {
      fetchCommunity();
    }
  }, [communityId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-500">Loading community details...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Community Not Found</h1>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">{community.name}</h1>
          <div className="flex items-center text-gray-600 space-x-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {community.region || "Unknown Region"}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {community._count.members} Members
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                {community.description || "No description provided."}
              </p>
            </div>

            {/* Realtime Updates Feed */}
            <RealtimeFeed communityId={community.id} initialUpdates={community.articles || []} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Find/Offer Mentorship */}
            <MentorshipCard communityId={community.id} />

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Explore</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/map")}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  View on Interactive Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
