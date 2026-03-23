"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function InquiryDeleteButton({ inquiryId }: { inquiryId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (session?.user?.role !== "admin") return null;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("문의를 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      alert("삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors rounded-lg flex-shrink-0"
      title="문의 삭제"
    >
      <Trash2 size={15} />
    </button>
  );
}
