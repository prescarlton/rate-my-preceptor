"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // Hide logout button on login page
  if (pathname === "/login") {
    return null;
  }

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        disabled={loading}
        className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-white/20 dark:border-zinc-800/50 shadow-lg hover:shadow-xl"
      >
        {loading ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}

