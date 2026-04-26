import { CommunityDirectory } from "@/components/community-directory"

export default function CommunitiesPage() {
  return (
    <div className="flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 glass-card p-8">
          <h1 className="text-3xl font-display font-bold text-wiki-text mb-2">
            Community Directory
          </h1>
          <p className="text-wiki-muted">
            Discover and connect with Ọ̀kun communities preserving their heritage and culture.
          </p>
        </div>
        
        <CommunityDirectory showJoinButton={true} />
      </div>
    </div>
  )
}