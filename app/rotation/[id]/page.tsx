import Link from "next/link";
import getRotation from "../../actions/get-rotation";
import AddRotationReviewModal from "./add-review-modal";

function StarRating({ rating }: { rating: number | string }) {
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

export default async function RotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const rotationId = (await params).id;
  const rotation = await getRotation(rotationId);

  if (!rotation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <Link
            href="/rotations"
            className="mb-8 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            ← Back to rotations
          </Link>
          <div className="rounded-lg border border-zinc-200 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-8 shadow-sm dark:border-zinc-800">
            <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
              Rotation not found
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              The rotation you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/rotations"
          className="mb-8 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          ← Back to rotations
        </Link>

        {/* Rotation Header */}
        <div className="mb-8 rounded-lg border border-zinc-200 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-8 shadow-sm dark:border-zinc-800">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            {rotation.name}
          </h1>
          <div className="flex items-center gap-1.5 text-lg text-zinc-600 dark:text-zinc-400 mb-4">
            <span>📍</span>
            <span>{rotation.location}</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <StarRating rating={rotation.averageRating} />
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">
              {rotation.totalReviews} review
              {rotation.totalReviews !== 1 ? "s" : ""}
            </span>
          </div>
          {rotation.preceptors.length > 0 && (
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              {rotation.preceptors.length} preceptor
              {rotation.preceptors.length !== 1 ? "s" : ""} at this rotation
            </p>
          )}
        </div>

        {/* Preceptors Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-3xl font-bold text-black dark:text-zinc-50">
            Preceptors
          </h2>
          {rotation.preceptors.length === 0 ? (
            <div className="rounded-lg border border-zinc-200 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-12 text-center dark:border-zinc-800 shadow-sm">
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                No preceptors found at this rotation yet
              </p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
                Preceptors will appear here once they're added to this rotation
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rotation.preceptors.map((preceptor) => (
                <Link
                  key={preceptor.id}
                  href={`/preceptor/${preceptor.id}`}
                  className="group rounded-lg border border-zinc-200 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg hover:scale-[1.02] dark:border-zinc-800 dark:hover:border-blue-600"
                >
                  <h3 className="mb-2 text-xl font-semibold text-black group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400 transition-colors">
                    {preceptor.name}
                  </h3>
                  {preceptor.specialty && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-medium text-xs mb-3">
                      <span>🏥</span>
                      {preceptor.specialty}
                    </span>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <StarRating rating={preceptor.averageRating} />
                    <span className="text-xs text-zinc-500 dark:text-zinc-500">
                      {preceptor.totalReviews} review
                      {preceptor.totalReviews !== 1 ? "s" : ""}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-3xl font-bold text-black dark:text-zinc-50">
              Rotation Reviews
            </h2>
            <AddRotationReviewModal rotationId={rotation.id} />
          </div>
          {rotation.reviews.length === 0 ? (
            <div className="rounded-lg border border-zinc-200 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-12 text-center dark:border-zinc-800 shadow-sm">
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                No reviews yet. Be the first to rate this rotation!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {rotation.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border border-zinc-200 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-6 shadow-sm dark:border-zinc-800"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <StarRating rating={review.rating} />
                    <span className="text-sm text-zinc-500 dark:text-zinc-500">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {review.note}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

