"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function HeaderClient() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm text-gray-500 truncate">{pathname}</div>
      <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading}>
        <LogOut className="w-4 h-4 ml-2" />
        {loading ? "جارٍ الخروج..." : "تسجيل الخروج"}
      </Button>
    </div>
  );
}
