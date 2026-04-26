import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { MapPin, PenSquare, Calendar, User } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { MentorshipDashboard } from "@/components/profile/mentorship-dashboard";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await db.user.findUnique({ 
    where: { id }, 
    select: { name: true, mentorshipTracks: { select: { name: true } }, isApprovedWriter: true } 
  });
  return { title: user?.name || "User Profile" };
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const user = await db.user.findUnique({
    where: { id },
    include: {
      createdTowns: {
        where: { published: true },
        select: { name: true, slug: true, tagline: true },
        take: 10,
      },
      blogPosts: {
        where: { published: true },
        select: { title: true, slug: true, category: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      mentorshipTracks: true,
    },
  });

  if (!user) notFound();

  const session = await auth();
  const isOwnProfile = session?.user?.id === user.id;

  let myRequests: any[] = [];
  let activeConnections: any[] = [];
  let availableRequests: any[] = [];

  if (isOwnProfile) {
    const allUserMentorships = await db.mentorship.findMany({
      where: {
        OR: [{ mentorId: user.id }, { menteeId: user.id }],
        status: { in: ["PENDING", "ACTIVE"] }
      },
      include: {
        community: { select: { name: true } },
        mentor: { select: { name: true } },
        mentee: { select: { name: true } }
      }
    });

    myRequests = allUserMentorships.filter(m => m.status === "PENDING");
    activeConnections = allUserMentorships.filter(m => m.status === "ACTIVE");

    // Get user's communities to find opportunities
    const userCommunities = await db.userCommunity.findMany({
      where: { userId: user.id },
      select: { communityId: true }
    });
    const communityIds = userCommunities.map(uc => uc.communityId);

    availableRequests = await db.mentorship.findMany({
      where: {
        communityId: { in: communityIds },
        status: "PENDING",
        NOT: { OR: [{ mentorId: user.id }, { menteeId: user.id }] }
      },
      include: {
        community: { select: { name: true } },
        mentor: { select: { name: true } },
        mentee: { select: { name: true } }
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile header */}
      <Card className="mb-8">
        <CardContent className="py-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0">
              <User className="h-10 w-10 text-primary-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-wiki-text">{user.name || "Anonymous"}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant={user.role === "ADMIN" ? "primary" : user.role === "EDITOR" ? "earth" : "default"}>
                  {user.role}
                </Badge>
                {user.isApprovedWriter && (
                  <Badge variant="outline" className="border-gold-500 text-gold-600 bg-gold-50 dark:bg-gold-900/20">
                    Approved Writer
                  </Badge>
                )}
                <span className="text-sm text-wiki-muted flex items-center gap-1 ml-2">
                  <Calendar className="h-3 w-3" /> Joined {formatDate(user.createdAt)}
                </span>
                {user.location && (
                  <span className="text-sm text-wiki-muted flex items-center gap-1 ml-2">
                    <MapPin className="h-3 w-3" /> {user.location}
                  </span>
                )}
              </div>
              {user.bio && <p className="text-wiki-muted mt-3">{user.bio}</p>}
              
              {user.mentorshipTracks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-wiki-border">
                  <p className="text-sm font-semibold text-wiki-text mb-2">Mentorship Tracks</p>
                  <div className="flex gap-2 flex-wrap">
                    {user.mentorshipTracks.map((track, i) => (
                      <Badge key={i} variant="secondary" className="bg-forest-100 text-forest-700 dark:bg-forest-900/30 dark:text-forest-300">
                        {track.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Towns */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-500" />
              <h2 className="font-semibold text-wiki-text">Towns ({user.createdTowns.length})</h2>
            </div>
          </CardHeader>
          <CardContent>
            {user.createdTowns.length > 0 ? (
              <div className="space-y-3">
                {user.createdTowns.map((town) => (
                  <Link key={town.slug} href={`/towns/${town.slug}`} className="block no-underline hover:bg-wiki-hover rounded-lg p-2 -mx-2 transition-colors">
                    <p className="font-medium text-wiki-text">{town.name}</p>
                    {town.tagline && <p className="text-sm text-wiki-muted">{town.tagline}</p>}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-wiki-muted">No towns contributed yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Blog Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PenSquare className="h-5 w-5 text-primary-500" />
              <h2 className="font-semibold text-wiki-text">Articles ({user.blogPosts.length})</h2>
            </div>
          </CardHeader>
          <CardContent>
            {user.blogPosts.length > 0 ? (
              <div className="space-y-3">
                {user.blogPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="block no-underline hover:bg-wiki-hover rounded-lg p-2 -mx-2 transition-colors">
                    <p className="font-medium text-wiki-text">{post.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="primary">{post.category.charAt(0) + post.category.slice(1).toLowerCase()}</Badge>
                      <span className="text-xs text-wiki-muted">{formatDate(post.createdAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-wiki-muted">No articles published yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {isOwnProfile && (
        <div className="mt-8 pt-8 border-t border-wiki-border">
          <MentorshipDashboard 
            userId={user.id} 
            myRequests={myRequests} 
            activeConnections={activeConnections} 
            availableRequests={availableRequests} 
          />
        </div>
      )}
    </div>
  );
}
