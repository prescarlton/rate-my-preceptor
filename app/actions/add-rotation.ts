"use server";

import { db } from "@/db";
import { rotations } from "@/db/schema";
import { and, eq } from "drizzle-orm";

interface Payload {
  name: string;
  location: string;
}

export default async function addRotation(payload: Payload) {
  try {
    // Validate input
    if (!payload.name?.trim() || !payload.location?.trim()) {
      console.error("Add rotation: Missing required fields", payload);
      return null;
    }

    // Check if rotation already exists
    const existing = await db
      .select()
      .from(rotations)
      .where(
        and(
          eq(rotations.name, payload.name.trim()),
          eq(rotations.location, payload.location.trim())
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return existing[0].id;
    }

    // Create new rotation
    const result = await db
      .insert(rotations)
      .values({
        name: payload.name.trim(),
        location: payload.location.trim(),
      })
      .returning({ id: rotations.id });
    
    if (!result || result.length === 0) {
      console.error("Add rotation: Failed to create rotation");
      return null;
    }

    return result[0].id;
  } catch (error) {
    console.error("Add rotation error:", error);
    return null;
  }
}

