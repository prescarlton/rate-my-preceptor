"use server";

import { db } from "@/db";
import { rotationReviews, rotations } from "@/db/schema";
import { eq } from "drizzle-orm";

interface Payload {
  rotationId: string;
  rating: number;
  note: string;
}

export default async function rateRotation(payload: Payload) {
  try {
    // Validate input
    if (!payload.rotationId?.trim()) {
      console.error("Rate rotation: Missing rotation ID");
      return false;
    }

    if (!payload.rating || payload.rating < 1 || payload.rating > 5) {
      console.error("Rate rotation: Invalid rating", payload.rating);
      return false;
    }

    if (!payload.note?.trim()) {
      console.error("Rate rotation: Missing review note");
      return false;
    }

    // Verify rotation exists
    const rotationExists = await db
      .select({ id: rotations.id })
      .from(rotations)
      .where(eq(rotations.id, payload.rotationId))
      .limit(1);

    if (rotationExists.length === 0) {
      console.error("Rate rotation: Rotation not found", payload.rotationId);
      return false;
    }

    // Insert the review
    await db.insert(rotationReviews).values({
      rotationId: payload.rotationId,
      rating: payload.rating,
      note: payload.note.trim(),
    });

    // Recalculate average rating and total reviews
    const allReviews = await db
      .select({ rating: rotationReviews.rating })
      .from(rotationReviews)
      .where(eq(rotationReviews.rotationId, payload.rotationId));

    const totalReviews = allReviews.length;
    const avgRating =
      totalReviews > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // Update the rotation's average rating and total reviews
    await db
      .update(rotations)
      .set({
        averageRating: avgRating.toString(),
        totalReviews: totalReviews,
      })
      .where(eq(rotations.id, payload.rotationId));

    return true;
  } catch (error) {
    console.error("Rate rotation error:", error);
    return false;
  }
}

