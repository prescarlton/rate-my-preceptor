import Link from "next/link";
import getRotations from "../actions/get-rotations";

export default async function RotationsPage() {
  const rotations = await getRotations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            ← Back to home
          </Link>
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
            All Rotations
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Browse rotations and see all preceptors at each location
          </p>
        </div>

        {/* Rotations List */}
        {rotations.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-12 text-center dark:border-zinc-800 shadow-sm">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              No rotations found
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              Rotations will appear here once preceptors are added
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rotations.map((rotation) => (
              <Link
                key={rotation.id}
                href={`/rotation/${rotation.id}`}
                className="group rounded-lg border border-zinc-200 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg hover:scale-[1.02] dark:border-zinc-800 dark:hover:border-blue-600"
              >
                <h2 className="mb-2 text-xl font-semibold text-black group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400 transition-colors">
                  {rotation.name}
                </h2>
                <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <span>📍</span>
                  <span>{rotation.location}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

