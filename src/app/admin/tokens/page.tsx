"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Copy, Check, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Token {
  id: string;
  token: string;
  used: boolean;
  usedBy: string | null;
  note: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export default function TokensPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [note, setNote] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchTokens = async () => {
    const res = await fetch("/api/admin/tokens");
    const data = await res.json();
    setTokens(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const createToken = async () => {
    setCreating(true);
    await fetch("/api/admin/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    setNote("");
    await fetchTokens();
    setCreating(false);
  };

  const deleteToken = async (id: string) => {
    if (!confirm("이 토큰을 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/tokens/${id}`, { method: "DELETE" });
    setTokens((prev) => prev.filter((t) => t.id !== id));
  };

  const copyToken = (token: string, id: string) => {
    navigator.clipboard.writeText(token);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-zinc-100">초대 토큰 관리</h1>
        <p className="text-zinc-400 mt-1">회원가입에 필요한 초대 토큰을 생성하고 관리합니다.</p>
      </div>

      {/* 토큰 생성 */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 mb-6">
        <h2 className="font-bold text-zinc-100 mb-4">새 토큰 발급</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="메모 (선택사항, 예: 홍길동용)"
            className="flex-1 px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
          />
          <button
            onClick={createToken}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-500 transition-colors disabled:opacity-50"
          >
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            발급
          </button>
        </div>
      </div>

      {/* 토큰 목록 */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-zinc-500" />
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">발급된 토큰이 없습니다.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800">
                <th className="text-left text-xs font-semibold text-zinc-400 px-5 py-3">토큰</th>
                <th className="text-left text-xs font-semibold text-zinc-400 px-5 py-3">메모</th>
                <th className="text-left text-xs font-semibold text-zinc-400 px-5 py-3">상태</th>
                <th className="text-left text-xs font-semibold text-zinc-400 px-5 py-3">발급일</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {tokens.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-800 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-zinc-400 font-mono bg-zinc-800 px-2 py-1 rounded">
                        {t.token.slice(0, 12)}…
                      </code>
                      <button
                        onClick={() => copyToken(t.token, t.id)}
                        className="text-zinc-500 hover:text-zinc-200 transition-colors"
                        title="복사"
                      >
                        {copiedId === t.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-zinc-400">{t.note ?? "-"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        t.used ? "bg-zinc-800 text-zinc-400" : "bg-green-500/15 text-green-400"
                      }`}
                    >
                      {t.used ? "사용됨" : "미사용"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-zinc-500">
                    {format(new Date(t.createdAt), "yyyy.MM.dd", { locale: ko })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => deleteToken(t.id)}
                      className="text-zinc-500 hover:text-red-400 transition-colors"
                      title="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
