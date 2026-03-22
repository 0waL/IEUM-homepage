"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Send, Trash2, MessageSquare } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: { name: string; role: string };
}

interface Props {
  inquiryId: string;
  comments: Comment[];
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function InquiryCommentSection({ inquiryId, comments: initial }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState(initial);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "오류가 발생했습니다.");
      }
      const newComment = await res.json();
      setComments([...comments, newComment]);
      setContent("");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}/comments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      if (!res.ok) throw new Error();
      setComments(comments.filter((c) => c.id !== commentId));
      router.refresh();
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div>
      <h2 className="flex items-center gap-2 text-white font-semibold mb-4">
        <MessageSquare size={16} className="text-primary-400" />
        댓글 {comments.length > 0 && <span className="text-zinc-500 font-normal text-sm">{comments.length}개</span>}
      </h2>

      {comments.length === 0 && !session && (
        <p className="text-zinc-600 text-sm py-8 text-center border border-white/5 rounded-2xl">
          아직 답변이 없습니다.
        </p>
      )}

      {/* Comment list */}
      {comments.length > 0 && (
        <div className="space-y-3 mb-5">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-navy-900/40 border border-white/5 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{comment.user.name}</span>
                  {comment.user.role === "admin" && (
                    <span className="text-xs px-2 py-0.5 bg-primary-900/60 text-primary-400 rounded-full">
                      관리자
                    </span>
                  )}
                  <span className="text-xs text-zinc-600">{formatDate(comment.createdAt)}</span>
                </div>
                {session?.user?.role === "admin" && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors rounded-lg"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Reply form (admin only) */}
      {session && (
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="답변을 입력해 주세요..."
            rows={4}
            required
            className="w-full bg-navy-900/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-primary-500 transition-colors resize-none mb-3"
          />
          {error && (
            <p className="text-red-400 text-sm mb-3">{error}</p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-full text-sm font-semibold transition-colors"
            >
              <Send size={13} />
              {loading ? "제출 중..." : "답변 등록"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
