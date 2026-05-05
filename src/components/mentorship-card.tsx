"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, Handshake, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface MentorshipCardProps {
  communityId: string;
}

export function MentorshipCard({ communityId }: MentorshipCardProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestMentorship = async (role: "MENTEE" | "MENTOR") => {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/communities/${communityId}/mentorship`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (response.ok) {
        alert(
          role === "MENTEE"
            ? "Mentorship request sent! A mentor will review it soon."
            : "Thank you for offering to mentor! We've registered your interest.",
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 overflow-hidden relative group"
    >
      <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <GraduationCap size={150} />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2 text-wiki-text flex items-center gap-2">
          <Handshake className="w-6 h-6 text-primary-500" />
          Mentorship Program
        </h2>
        <p className="text-sm text-wiki-muted mb-6 max-w-md">
          Connect with experienced community members to learn, or offer your knowledge to guide
          emerging members in Okunland.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            disabled={loading}
            onClick={() => handleRequestMentorship("MENTEE")}
            className="flex-1 justify-between group/btn"
          >
            Find a Mentor
            <ChevronRight className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
          </Button>
          <Button
            disabled={loading}
            variant="outline"
            onClick={() => handleRequestMentorship("MENTOR")}
            className="flex-1 justify-between group/btn border-primary-500/30 hover:bg-primary-500/10"
          >
            Offer Mentorship
            <ChevronRight className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
          </Button>
        </div>

        {!session && (
          <p className="text-xs text-wiki-muted mt-4 text-center">
            You will be prompted to sign in to join the program.
          </p>
        )}
      </div>
    </motion.div>
  );
}
