import Link from "next/link";
import { db } from "@/db";
import { preceptors, preceptorReviews, rotations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import EditPreceptorModal from "./edit-preceptor-modal";
import AddReviewModal from "./add-review-modal";

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

async function getPreceptorData(id: string) {
  const result = await db
    .select({
      id: preceptors.id,
      name: preceptors.name,
      specialty: preceptors.specialty,
      averageRating: preceptors.averageRating,
      totalReviews: preceptors.totalReviews,
      rotation: {
        id: rotations.id,
        name: rotations.name,
        location: rotations.location,
      },
    })
    .from(preceptors)
    .innerJoin(rotations, eq(preceptors.rotationId, rotations.id))
    .where(eq(preceptors.id, id))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const preceptor = result[0];

  const reviews = await db
    .select()
    .from(preceptorReviews)
    .where(eq(preceptorReviews.preceptorId, preceptor.id))
    .orderBy(desc(preceptorReviews.created));

  return {
    ...preceptor,
    reviews: reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      note: review.note,
      date: review.created.toISOString(),
    })),
  };
}

export default async function PreceptorProfile({
  params,
}: {
  params: { id: string };
}) {
  const precepId = (await params).id;
  const preceptor = await getPreceptorData(precepId);

  if (!preceptor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <Link
            href="/"
            className="mb-8 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
          >
            ← Back to search
          </Link>
          <div className="rounded-lg border border-zinc-200 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-8 shadow-sm dark:border-zinc-800">
            <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
              Preceptor not found
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {"The preceptor you're looking for doesn't exist yet."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/"
          className="mb-8 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
        >
          ← Back to search
        </Link>

        {/* Preceptor Header */}
        <div className="mb-8 rounded-lg border border-zinc-200 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-8 shadow-sm dark:border-zinc-800">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
              {preceptor?.name}
            </h1>
            <EditPreceptorModal
              preceptor={{
                id: preceptor.id,
                name: preceptor.name,
                specialty: preceptor.specialty,
                rotation: preceptor.rotation,
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-zinc-600 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-medium text-sm">
              <span>🏥</span>
              {preceptor?.specialty}
            </span>
            <Link
              href={`/rotation/${preceptor?.rotation?.id}`}
              className="group flex items-center gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-all cursor-pointer px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
            >
              <span>📍</span>
              <span className="underline decoration-dotted underline-offset-4 group-hover:decoration-solid">
                {preceptor?.rotation?.name} - {preceptor?.rotation?.location}
              </span>
              <svg
                className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-6 pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800">
            <StarRating rating={preceptor?.averageRating} />
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">
              {preceptor?.totalReviews} review
              {preceptor?.totalReviews !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-3xl font-bold text-black dark:text-zinc-50">
              Reviews
            </h2>
            <AddReviewModal preceptorId={preceptor.id} />
          </div>
          {preceptor?.reviews.length === 0 ? (
            <div className="rounded-lg border border-zinc-200 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-12 text-center dark:border-zinc-800 shadow-sm">
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                No reviews yet. Be the first to rate this preceptor!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {preceptor?.reviews.map((review) => (
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
