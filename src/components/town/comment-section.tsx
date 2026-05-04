"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment, deleteComment } from "@/lib/actions/comments";
import { MessageSquare, Trash2, Reply } from "lucide-react";

// Typing out the expected comment structure
type CommentAuthor = { id: string; name: string | null; image: string | null };
export type TownComment = {
  id: string;
  content: string;
  createdAt: Date;
  authorId: string;
  parentId: string | null;
  author: CommentAuthor;
  replies?: TownComment[];
};

export function CommentSection({
  townId,
  initialComments,
}: {
  townId: string;
  initialComments: TownComment[];
}) {
  const { data: session } = useSession();
  const [comments] = useState<TownComment[]>(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // For replying to a specific comment
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Optimistic add and server action
  const handlePost = async () => {
    if (!content.trim() || !session?.user) return;
    setLoading(true);

    try {
      await addComment({ content, townId });
      // For a truly robust app, we'd refetch or rely on React Query / Next.js Server Action revalidation
      // Here we just reload the page to get the fresh tree
      window.location.reload();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim() || !session?.user) return;
    setLoading(true);
    try {
      await addComment({ content: replyContent, townId, parentId });
      window.location.reload();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete comment?")) return;
    try {
      await deleteComment(id);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  // Recursive component to render comment threads
  const CommentNode = ({ comment, depth = 0 }: { comment: TownComment; depth?: number }) => (
    <div
      className={`flex gap-4 ${depth > 0 ? "ml-8 mt-4 border-l border-wiki-border pl-4" : "mt-6"}`}
    >
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.author.image || undefined} />
        <AvatarFallback>{comment.author.name?.[0] || "U"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="font-semibold text-wiki-text text-sm">
            {comment.author.name || "Anonymous"}
          </span>
          <span className="text-xs text-wiki-muted">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-wiki-secondary">{comment.content}</p>

        <div className="flex gap-4 items-center">
          {session?.user &&
            depth < 2 && ( // Limit depth to 2 to prevent extreme nesting
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-xs text-wiki-muted hover:text-blue-500 flex items-center gap-1 transition-colors"
              >
                <Reply className="w-3 h-3" /> Reply
              </button>
            )}
          {session?.user?.id === comment.authorId && (
            <button
              onClick={() => handleDelete(comment.id)}
              className="text-xs text-wiki-muted hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          )}
        </div>

        {replyingTo === comment.id && (
          <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2">
            <Textarea
              className="text-sm min-h-[80px]"
              placeholder={`Replying to ${comment.author.name}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleReply(comment.id)}
                disabled={loading || !replyContent.trim()}
              >
                {loading ? "Posting..." : "Reply"}
              </Button>
            </div>
          </div>
        )}

        {/* Render children recursively */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => (
              <CommentNode key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 mt-16 pt-8 border-t border-wiki-border">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-wiki-primary" />
        <h2 className="text-2xl font-bold text-wiki-text tracking-tight">Community Voices</h2>
      </div>

      {session ? (
        <div className="flex gap-4">
          <Avatar className="w-10 h-10 hidden sm:block">
            <AvatarImage src={session.user?.image || undefined} />
            <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Share your thoughts, history, or experiences about this town..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] text-base"
            />
            <div className="flex justify-end">
              <Button onClick={handlePost} disabled={!content.trim() || loading}>
                {loading ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-wiki-surface border border-wiki-border rounded-lg p-6 text-center">
          <p className="text-wiki-muted mb-4">You must be signed in to join the conversation.</p>
          <Button onClick={() => (window.location.href = "/auth/login")}>Sign In to Comment</Button>
        </div>
      )}

      <div className="space-y-2">
        {comments.length === 0 ? (
          <p className="text-wiki-muted text-center py-8">
            No comments yet. Be the first to share!
          </p>
        ) : (
          comments.map((comment) => <CommentNode key={comment.id} comment={comment} />)
        )}
      </div>
    </div>
  );
}
