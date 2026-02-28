"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(true)} className="p-2 text-wiki-muted hover:text-wiki-text cursor-pointer">
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-50"
              style={{ backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-72 border-l border-wiki-border z-50"
              style={{ background: "var(--color-wiki-card-strong)", backdropFilter: "blur(16px)" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-wiki-border">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-gradient-to-br from-coral-500 to-coral-700 text-white">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="font-bold bg-gradient-to-r from-coral-500 to-coral-700 bg-clip-text text-transparent">Ọ̀kun Wiki</span>
                </div>
                <button onClick={() => setOpen(false)} className="p-1 cursor-pointer text-wiki-muted hover:text-wiki-text">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {[
                  { href: "/", label: "Home" },
                  { href: "/towns", label: "Towns" },
                  { href: "/blog", label: "Blog" },
                  { href: "/about", label: "About" },
                  { href: "/search", label: "Search" },
                  { href: "/auth/login", label: "Sign in" },
                  { href: "/auth/register", label: "Create account" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm text-wiki-muted hover:bg-wiki-hover hover:text-coral-500 no-underline transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
