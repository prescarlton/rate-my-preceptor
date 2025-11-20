import Link from "next/link";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="mb-2 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              ← Back to home
            </Link>
            <div className="h-9 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="mt-2 h-5 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
          </div>
          <div className="h-10 w-32 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"></div>
        </div>

        {/* Loading Skeleton Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
              <div className="mb-3 space-y-2">
                <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
              </div>
              <div className="mt-4 h-5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

