"use server";

import { db } from "@/db";
import { preceptors } from "@/db/schema";
import { eq } from "drizzle-orm";
import addRotation from "./add-rotation";

interface Payload {
  id: string;
  name: string;
  specialty: string;
  rotationName: string;
  rotationLocation: string;
}

export default async function updatePreceptor(payload: Payload) {
  try {
    // Validate input
    if (!payload.id?.trim() || !payload.name?.trim() || !payload.specialty?.trim() || !payload.rotationName?.trim() || !payload.rotationLocation?.trim()) {
      console.error("Update preceptor: Missing required fields", payload);
      return null;
    }

    // First, get or create the rotation
    const rotationId = await addRotation({
      name: payload.rotationName.trim(),
      location: payload.rotationLocation.trim(),
    });

    if (!rotationId) {
      console.error("Update preceptor: Failed to create or find rotation");
      return null;
    }

    // Then update the preceptor
    const result = await db
      .update(preceptors)
      .set({
        name: payload.name.trim(),
        specialty: payload.specialty.trim(),
        rotationId: rotationId,
      })
      .where(eq(preceptors.id, payload.id))
      .returning({ id: preceptors.id });
    
    if (!result || result.length === 0) {
      console.error("Update preceptor: Preceptor not found or update failed", payload.id);
      return null;
    }

    return result[0].id;
  } catch (error) {
    console.error("Update preceptor error:", error);
    return null;
  }
}

