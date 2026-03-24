"use client";

import { useState } from "react";
import { Send, Loader2, ExternalLink, CheckCircle } from "lucide-react";

const inputClass =
  "w-full px-4 py-3 bg-navy-800 border border-white/10 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-colors";

const GRADES = ["1학년", "2학년", "3학년"];
const FIELDS = ["웹 개발", "앱 개발", "디자인", "기획", "기타"];

export function ApplyForm({ formUrl }: { formUrl: string }) {
  const [form, setForm] = useState({ name: "", grade: "", field: "", motivation: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.grade || !form.field || !form.motivation.trim()) {
      setError("이름, 학년, 관심 분야, 지원 동기는 필수입니다.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      setError(data.error ?? "제출 중 오류가 발생했습니다.");
    }
  };

  if (submitted) {
    return (
      <div className="bg-navy-800 border border-white/10 rounded-2xl p-10 text-center">
        <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">지원서가 제출되었습니다!</h3>
        <p className="text-zinc-400 text-sm">검토 후 개인적으로 연락드리겠습니다. 감사합니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="bg-navy-800 border border-white/10 rounded-2xl p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">이름 *</label>
            <input value={form.name} onChange={set("name")} placeholder="홍길동" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">학년 *</label>
            <select value={form.grade} onChange={set("grade")} className={inputClass}>
              <option value="">선택하세요</option>
              {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">관심 분야 *</label>
          <select value={form.field} onChange={set("field")} className={inputClass}>
            <option value="">선택하세요</option>
            {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">지원 동기 *</label>
          <textarea
            value={form.motivation}
            onChange={set("motivation")}
            rows={5}
            placeholder="이음에 지원하는 이유와 앞으로 하고 싶은 것을 자유롭게 작성해주세요."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">이메일 <span className="text-zinc-600">(선택)</span></label>
          <input value={form.email} onChange={set("email")} type="email" placeholder="example@gshs.hs.kr" className={inputClass} />
          <p className="text-xs text-zinc-600 mt-1">결과 안내 시 활용됩니다.</p>
        </div>

        {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-500 disabled:opacity-50 transition-colors"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          지원서 제출하기
        </button>
      </form>

      {formUrl && (
        <div className="text-center">
          <p className="text-xs text-zinc-600 mb-2">또는 구글 폼으로 지원하기</p>
          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 text-zinc-400 rounded-xl text-sm hover:bg-white/5 hover:text-zinc-200 transition-colors"
          >
            구글 폼 열기
            <ExternalLink size={13} />
          </a>
        </div>
      )}
    </div>
  );
}
