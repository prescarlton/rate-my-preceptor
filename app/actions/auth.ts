"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SITE_PASSWORD = process.env.SITE_PASSWORD || "changeme";

export async function login(password: string) {
  if (password === SITE_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Incorrect password" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth");
  redirect("/login");
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth");
  return authCookie?.value === "authenticated";
}

