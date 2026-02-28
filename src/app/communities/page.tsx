import { CommunityDirectory } from "@/components/community-directory"

export default function CommunitiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Community Directory
          </h1>
          <p className="text-gray-600">
            Discover and connect with Okunn communities preserving their heritage and culture.
          </p>
        </div>
        
        <CommunityDirectory showJoinButton={true} />
      </div>
    </div>
  )
}