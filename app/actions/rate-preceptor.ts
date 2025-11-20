"use server";

import { db } from "@/db";
import { preceptorReviews, preceptors } from "@/db/schema";
import { eq } from "drizzle-orm";

interface Payload {
  preceptorId: string;
  rating: number;
  note: string;
}

export default async function ratePreceptor(payload: Payload) {
  try {
    // Validate input
    if (!payload.preceptorId?.trim()) {
      console.error("Rate preceptor: Missing preceptor ID");
      return false;
    }

    if (!payload.rating || payload.rating < 1 || payload.rating > 5) {
      console.error("Rate preceptor: Invalid rating", payload.rating);
      return false;
    }

    if (!payload.note?.trim()) {
      console.error("Rate preceptor: Missing review note");
      return false;
    }

    // Verify preceptor exists
    const preceptorExists = await db
      .select({ id: preceptors.id })
      .from(preceptors)
      .where(eq(preceptors.id, payload.preceptorId))
      .limit(1);

    if (preceptorExists.length === 0) {
      console.error("Rate preceptor: Preceptor not found", payload.preceptorId);
      return false;
    }

    // Insert the review
    await db.insert(preceptorReviews).values({
      preceptorId: payload.preceptorId,
      rating: payload.rating,
      note: payload.note.trim(),
    });

    // Recalculate average rating and total reviews
    const allReviews = await db
      .select({ rating: preceptorReviews.rating })
      .from(preceptorReviews)
      .where(eq(preceptorReviews.preceptorId, payload.preceptorId));

    const totalReviews = allReviews.length;
    const avgRating =
      totalReviews > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // Update the preceptor's average rating and total reviews
    await db
      .update(preceptors)
      .set({
        averageRating: avgRating.toString(),
        totalReviews: totalReviews,
      })
      .where(eq(preceptors.id, payload.preceptorId));

    return true;
  } catch (error) {
    console.error("Rate preceptor error:", error);
    return false;
  }
}
