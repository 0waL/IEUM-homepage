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
      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
    >
      <Trash2 size={14} />
    </button>
  );
}
