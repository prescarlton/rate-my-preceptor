"use server";

import { db } from "@/db";
import { preceptors, rotations } from "@/db/schema";
import { ilike, eq, or } from "drizzle-orm";

export default async function search({ query }: { query: string }) {
  try {
    const searchTerm = query?.trim() || "";
    
    // If no query, return all preceptors
    if (!searchTerm) {
      const result = await db
        .select({
          id: preceptors.id,
          name: preceptors.name,
          specialty: preceptors.specialty,
          averageRating: preceptors.averageRating,
          rotation: {
            id: rotations.id,
            name: rotations.name,
            location: rotations.location,
          },
        })
        .from(preceptors)
        .innerJoin(rotations, eq(preceptors.rotationId, rotations.id));
      return result;
    }

    // Search by name, specialty, rotation name, or rotation location (case-insensitive)
    const result = await db
      .select({
        id: preceptors.id,
        name: preceptors.name,
        specialty: preceptors.specialty,
        averageRating: preceptors.averageRating,
        rotation: {
          id: rotations.id,
          name: rotations.name,
          location: rotations.location,
        },
      })
      .from(preceptors)
      .innerJoin(rotations, eq(preceptors.rotationId, rotations.id))
      .where(
        or(
          ilike(preceptors.name, `%${searchTerm}%`),
          ilike(preceptors.specialty, `%${searchTerm}%`),
          ilike(rotations.name, `%${searchTerm}%`),
          ilike(rotations.location, `%${searchTerm}%`)
        )
      );
    
    return result;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
