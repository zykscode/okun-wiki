"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

const MOCK_USER: CommentAuthor = {
  id: "mock-user-1",
  name: "Guest",
  image: null,
};

export function CommentSection({
  townId,
  initialComments = [],
}: {
  townId: string;
  initialComments?: TownComment[];
}) {
  const [comments, setComments] = useState<TownComment[]>(initialComments);
  const [content, setContent] = useState("");

  // For replying to a specific comment
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Optimistic add and server action
  const handlePost = () => {
    if (!content.trim()) return;

    const newComment: TownComment = {
      id: Math.random().toString(36).substring(7),
      content,
      createdAt: new Date(),
      authorId: MOCK_USER.id,
      parentId: null,
      author: MOCK_USER,
      replies: [],
    };

    setComments((prev) => [newComment, ...prev]);
    setContent("");
  };

  const handleReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const newComment: TownComment = {
      id: Math.random().toString(36).substring(7),
      content: replyContent,
      createdAt: new Date(),
      authorId: MOCK_USER.id,
      parentId,
      author: MOCK_USER,
      replies: [],
    };

    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId ? { ...c, replies: [...(c.replies || []), newComment] } : c,
      ),
    );
    setReplyingTo(null);
    setReplyContent("");
  };

  const handleDelete = (id: string, parentId: string | null = null) => {
    if (!confirm("Delete comment?")) return;
    if (parentId) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId ? { ...c, replies: c.replies?.filter((r) => r.id !== id) } : c,
        ),
      );
    } else {
      setComments((prev) => prev.filter((c) => c.id !== id));
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
          {depth < 2 && ( // Limit depth to 2 to prevent extreme nesting
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="text-xs text-wiki-muted hover:text-blue-500 flex items-center gap-1 transition-colors"
            >
              <Reply className="w-3 h-3" /> Reply
            </button>
          )}
          {comment.authorId === MOCK_USER.id && (
            <button
              onClick={() => handleDelete(comment.id, comment.parentId)}
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
                disabled={!replyContent.trim()}
              >
                Reply
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

      <div className="flex gap-4">
        <Avatar className="w-10 h-10 hidden sm:block">
          <AvatarFallback>{MOCK_USER.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="Share your thoughts, history, or experiences about this town..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] text-base"
          />
          <div className="flex justify-end">
            <Button onClick={handlePost} disabled={!content.trim()}>
              Post Comment
            </Button>
          </div>
        </div>
      </div>

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
