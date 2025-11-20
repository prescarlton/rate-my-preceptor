"use server";

import { db } from "@/db";
import { preceptors } from "@/db/schema";
import addRotation from "./add-rotation";

interface Payload {
  name: string;
  specialty: string;
  rotationName: string;
  rotationLocation: string;
}

export default async function addPreceptor(payload: Payload) {
  try {
    // Validate input
    if (!payload.name?.trim() || !payload.specialty?.trim() || !payload.rotationName?.trim() || !payload.rotationLocation?.trim()) {
      console.error("Add preceptor: Missing required fields", payload);
      return null;
    }

    // First, get or create the rotation
    const rotationId = await addRotation({
      name: payload.rotationName.trim(),
      location: payload.rotationLocation.trim(),
    });

    if (!rotationId) {
      console.error("Add preceptor: Failed to create or find rotation");
      return null;
    }

    // Then create the preceptor
    const result = await db
      .insert(preceptors)
      .values({
        name: payload.name.trim(),
        specialty: payload.specialty.trim(),
        rotationId: rotationId,
      })
      .returning({ id: preceptors.id });
    
    if (!result || result.length === 0) {
      console.error("Add preceptor: Failed to create preceptor");
      return null;
    }

    return result[0].id;
  } catch (error) {
    console.error("Add preceptor error:", error);
    return null;
  }
}
