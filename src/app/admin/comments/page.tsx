import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { CommentActions } from "@/components/admin/comment-actions";

export default async function AdminCommentsPage() {
  const comments = await db.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, email: true } },
      town: { select: { name: true, slug: true } },
      page: { select: { title: true } },
    },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-wiki-text mb-6">Comments</h1>
      <div className="space-y-3">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-medium text-sm text-wiki-text">{comment.author.name || comment.author.email}</span>
                    {comment.flagged && <Badge variant="default">🚩 Flagged</Badge>}
                    {!comment.approved && <Badge variant="default">Pending</Badge>}
                    {comment.town && <Badge variant="primary">{comment.town.name}</Badge>}
                    {comment.page && <Badge variant="earth">{comment.page.title}</Badge>}
                  </div>
                  <p className="text-sm text-wiki-text">{comment.content}</p>
                  <p className="text-xs text-wiki-muted mt-1">{formatDate(comment.createdAt)}</p>
                </div>
                <CommentActions commentId={comment.id} approved={comment.approved} />
              </div>
            </CardContent>
          </Card>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-wiki-muted py-12">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
