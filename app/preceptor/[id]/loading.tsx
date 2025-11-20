import Link from "next/link";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/"
          className="mb-8 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          ← Back to search
        </Link>

        {/* Preceptor Header Skeleton */}
        <div className="mb-8 border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-10 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="h-9 w-20 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"></div>
          </div>
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="h-5 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="h-5 w-56 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
          </div>
          <div className="mt-4 flex items-center gap-6">
            <div className="h-6 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="h-5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
          </div>
        </div>

        {/* Reviews Section Skeleton */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div className="h-8 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="h-9 w-28 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"></div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="h-6 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                  <div className="h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                  <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                  <div className="h-4 w-4/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

