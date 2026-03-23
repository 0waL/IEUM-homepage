"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

export default function NewInquiryPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, author: "익명" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "오류가 발생했습니다.");
      }
      const inquiry = await res.json();
      router.push(`/inquiries/${inquiry.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-navy-950 min-h-screen pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-6 sm:px-10">
        <Link
          href="/inquiries"
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          문의 목록
        </Link>

        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">문의 작성</h1>
        <p className="text-zinc-500 mb-8">궁금한 점을 남겨주시면 관리자가 답변해 드립니다. 익명으로 작성됩니다.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
              제목 <span className="text-primary-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="문의 제목을 입력해 주세요"
              required
              className="w-full bg-navy-900/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
              내용 <span className="text-primary-400">*</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="궁금한 점을 자유롭게 작성해 주세요."
              required
              rows={8}
              className="w-full bg-navy-900/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-primary-500 transition-colors resize-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-950/30 border border-red-800/30 px-4 py-3 rounded-xl">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/inquiries"
              className="px-5 py-2.5 text-sm text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-full transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-full text-sm font-semibold transition-colors"
            >
              <Send size={14} />
              {loading ? "제출 중..." : "문의 제출"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
