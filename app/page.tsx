"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // redirect to the search results page with the query as a URL parameter
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl dark:bg-blue-500/10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl dark:bg-purple-500/10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl dark:bg-indigo-500/5"></div>
      </div>

      <main className="flex w-full max-w-2xl flex-col items-center px-6 relative z-10">
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Rate My Preceptor
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            rate yo preceptors and whatnot
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full opacity-20 group-hover:opacity-30 blur transition-opacity duration-300"></div>
            <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-full border border-white/20 dark:border-zinc-800/50 shadow-xl">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a preceptor by name..."
                className="w-full rounded-full px-6 py-5 text-lg pr-28 bg-transparent border-0 focus-visible:ring-0 shadow-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
              <Button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Search
              </Button>
            </div>
          </div>
        </form>

        <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-md">
          Search by preceptor name, rotation name, specialty, or location.
        </p>

        <Link href="/rotations" className="mt-6">
          <Button variant="outline" className="rounded-full">
            View All Rotations →
          </Button>
        </Link>
      </main>
    </div>
  );
}
