import Link from "next/link";
import search from "../actions/search";
import AddPreceptorModal from "./add-preceptor-modal";

function StarRating({ rating }: { rating: number }) {
  const numRating = typeof rating === "string" ? parseFloat(rating) : rating;
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={i} className="text-yellow-400">
          ★
        </span>
      ))}
      {hasHalfStar && <span className="text-yellow-400">☆</span>}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span key={i} className="text-zinc-300 dark:text-zinc-700">
          ★
        </span>
      ))}
      <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
        {numRating.toFixed(1)}
      </span>
    </div>
  );
}

export default async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query || "";
  const results = await search({ query });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/"
              className="mb-4 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
            >
              ← Back to home
            </Link>
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
              {query ? `Search Results for "${query}"` : "All Preceptors"}
            </h1>
            {query && (
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>
          <AddPreceptorModal />
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-12 text-center dark:border-zinc-800 shadow-sm">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {query
                ? `No preceptors found matching "${query}"`
                : "No preceptors found"}
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              Be the first to add a preceptor!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((preceptor) => (
              <Link
                key={preceptor.id}
                href={`/preceptor/${preceptor.id}`}
                className="group rounded-lg border border-zinc-200 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg hover:scale-[1.02] dark:border-zinc-800 dark:hover:border-blue-600"
              >
                <h2 className="mb-2 text-xl font-semibold text-black group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                  {preceptor.name}
                </h2>
                <div className="mb-4 space-y-2">
                  {preceptor.specialty && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-medium text-xs">
                      <span>🏥</span>
                      {preceptor.specialty}
                    </span>
                  )}
                  <p className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                    <span>📍</span>
                    <span className="line-clamp-1">{preceptor.rotation.name} - {preceptor.rotation.location}</span>
                  </p>
                </div>
                <div className="mt-4">
                  <StarRating rating={preceptor.averageRating} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
