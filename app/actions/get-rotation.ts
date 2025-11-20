"use server";

import { db } from "@/db";
import { rotations, preceptors, rotationReviews } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function getRotation(id: string) {
  try {
    // Get the rotation
    const rotationResult = await db
      .select()
      .from(rotations)
      .where(eq(rotations.id, id))
      .limit(1);

    if (rotationResult.length === 0) {
      return null;
    }

    const rotation = rotationResult[0];

    // Get all preceptors for this rotation
    const preceptorsList = await db
      .select({
        id: preceptors.id,
        name: preceptors.name,
        specialty: preceptors.specialty,
        averageRating: preceptors.averageRating,
        totalReviews: preceptors.totalReviews,
      })
      .from(preceptors)
      .where(eq(preceptors.rotationId, id));

    // Get all reviews for this rotation
    const reviews = await db
      .select()
      .from(rotationReviews)
      .where(eq(rotationReviews.rotationId, id))
      .orderBy(desc(rotationReviews.created));

    return {
      ...rotation,
      preceptors: preceptorsList,
      reviews: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        note: review.note,
        date: review.created.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Get rotation error:", error);
    return null;
  }
}

