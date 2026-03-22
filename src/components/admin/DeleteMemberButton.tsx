"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteMemberButton({ memberId }: { memberId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("이 멤버를 삭제하시겠습니까?")) return;

    const res = await fetch(`/api/admin/members/${memberId}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-500/10"
    >
      <Trash2 size={14} />
    </button>
  );
}
