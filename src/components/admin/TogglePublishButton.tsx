"use client";

import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export function TogglePublishButton({
  postId,
  published,
}: {
  postId: string;
  published: boolean;
}) {
  const router = useRouter();

  const toggle = async () => {
    const res = await fetch(`/api/admin/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    if (res.ok) router.refresh();
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
        published
          ? "bg-green-50 text-green-700 hover:bg-green-100"
          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
      }`}
    >
      {published ? <Eye size={11} /> : <EyeOff size={11} />}
      {published ? "공개" : "임시저장"}
    </button>
  );
}
