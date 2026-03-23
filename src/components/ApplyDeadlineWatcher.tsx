"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ApplyDeadlineWatcher({ deadline }: { deadline: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!deadline) return;
    const ms = new Date(deadline).getTime() - Date.now();
    if (ms <= 0) return;
    const timer = setTimeout(() => router.refresh(), ms);
    return () => clearTimeout(timer);
  }, [deadline, router]);

  return null;
}
