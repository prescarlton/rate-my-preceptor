"use server";

import { db } from "@/db";
import { rotations } from "@/db/schema";
import { asc } from "drizzle-orm";

export default async function getRotations() {
  try {
    const result = await db.select().from(rotations).orderBy(asc(rotations.name));
    return result;
  } catch (error) {
    console.error("Get rotations error:", error);
    return [];
  }
}

