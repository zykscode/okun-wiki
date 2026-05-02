"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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

export function ThreadedComments({ townId, pageId }: ThreadedCommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [townId, pageId]);

  const fetchComments = async () => {
    try {
      const params = new URLSearchParams();
      if (townId) params.append("townId", townId);
      if (pageId) params.append("pageId", pageId);
      
      const res = await fetch(`/api/comments?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const handlePostComment = async (parentId: string | null = null) => {
    if (!session) return;
    const content = parentId ? replyContent : newComment;
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, townId, pageId, parentId }),
      });

      if (res.ok) {
        const created = await res.json();
        if (parentId) {
          setComments(prev => prev.map(c => 
            c.id === parentId 
              ? { ...c, replies: [...(c.replies || []), created] }
              : c
          ));
          setReplyingTo(null);
          setReplyContent("");
        } else {
          setComments(prev => [created, ...prev]);
          setNewComment("");
        }
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CommentNode = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isReply ? "mt-4 ml-8 border-l-2 border-wiki-border pl-4" : "mt-6"}`}
    >
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.author.image || undefined} />
        <AvatarFallback>{comment.author.name?.[0] || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{comment.author.name}</span>
          <span className="text-xs text-wiki-muted">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-wiki-text" dangerouslySetInnerHTML={{ __html: comment.content }} />
        
        {!isReply && session && (
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
                <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                <Button size="sm" onClick={() => handlePostComment(comment.id)} disabled={isSubmitting || !replyContent.trim()}>
                  Reply
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map(reply => (
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
      
      {session ? (
        <div className="flex gap-4 mb-8">
          <Avatar>
            <AvatarImage src={session.user?.image || undefined} />
            <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Join the discussion..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] bg-wiki-input border-wiki-border"
            />
            <div className="flex justify-end">
              <Button onClick={() => handlePostComment(null)} disabled={isSubmitting || !newComment.trim()}>
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-wiki-hover rounded-lg mb-8 text-center">
          <p className="text-sm text-wiki-muted mb-2">Please sign in to join the discussion.</p>
          <Button variant="outline" asChild>
            <a href="/auth/login">Sign In</a>
          </Button>
        </div>
      )}

      <div className="space-y-6 divide-y divide-wiki-border/50">
        {comments.length === 0 ? (
          <p className="text-center text-wiki-muted py-8">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map(comment => <CommentNode key={comment.id} comment={comment} />)
        )}
      </div>
    </div>
  );
}
