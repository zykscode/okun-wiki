"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";

interface CommentAuthor {
  id: string;
  name: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
  replies?: Comment[];
}

interface ThreadedCommentsProps {
  townId?: string;
  pageId?: string;
}

// Mock User for static demo
const MOCK_USER: CommentAuthor = {
  id: "mock-user-1",
  name: "Guest User",
  image: null,
};

export function ThreadedComments({ townId, pageId }: ThreadedCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handlePostComment = (parentId: string | null = null) => {
    const content = parentId ? replyContent : newComment;
    if (!content.trim()) return;

    const newCommentObj: Comment = {
      id: Math.random().toString(36).substring(7),
      content,
      createdAt: new Date().toISOString(),
      author: MOCK_USER,
      replies: [],
    };

    if (parentId) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId ? { ...c, replies: [...(c.replies || []), newCommentObj] } : c,
        ),
      );
      setReplyingTo(null);
      setReplyContent("");
    } else {
      setComments((prev) => [newCommentObj, ...prev]);
      setNewComment("");
    }
  };

  const CommentNode = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isReply ? "mt-4 ml-8 border-l-2 border-wiki-border pl-4" : "mt-6"}`}
    >
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.author.image || undefined} />
        <AvatarFallback>{comment.author.name?.[0] || "U"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{comment.author.name}</span>
          <span className="text-xs text-wiki-muted">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-wiki-text whitespace-pre-line">{comment.content}</p>

        {!isReply && (
          <div className="pt-1">
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="text-xs font-medium text-primary-500 hover:underline"
            >
              Reply
            </button>
          </div>
        )}

        <AnimatePresence>
          {replyingTo === comment.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 overflow-hidden"
            >
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px] text-sm bg-wiki-input border-wiki-border"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handlePostComment(comment.id)}
                  disabled={!replyContent.trim()}
                >
                  Reply
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map((reply) => (
              <CommentNode key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="glass-panel p-6">
      <h3 className="text-xl font-bold mb-6">Community Discussion</h3>

      <div className="flex gap-4 mb-8">
        <Avatar>
          <AvatarFallback>{MOCK_USER.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="Join the discussion as a guest..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] bg-wiki-input border-wiki-border"
          />
          <div className="flex justify-end">
            <Button onClick={() => handlePostComment(null)} disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6 divide-y divide-wiki-border/50">
        {comments.length === 0 ? (
          <p className="text-center text-wiki-muted py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => <CommentNode key={comment.id} comment={comment} />)
        )}
      </div>
    </div>
  );
}
