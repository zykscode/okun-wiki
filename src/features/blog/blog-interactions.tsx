"use client";

import { useState } from "react";
import { Heart, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogInteractionsProps {
  postId: string;
  initialLikes?: number;
}

export function BlogInteractions({ initialLikes = 0 }: BlogInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="flex items-center gap-4 py-6 border-y border-wiki-border my-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={`flex gap-2 rounded-full ${isLiked ? "text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-500/10" : "text-wiki-muted"}`}
      >
        <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
        <span className="font-semibold">{likes}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        className={`flex gap-2 rounded-full ${isBookmarked ? "text-primary-500 hover:text-primary-600 bg-primary-500/10" : "text-wiki-muted"}`}
      >
        <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
      </Button>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="rounded-full text-wiki-muted"
      >
        <Share2 className="w-5 h-5 mr-2" />
        Share
      </Button>
    </div>
  );
}
