"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, X, Loader2 } from "lucide-react";

interface Member {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  github: string | null;
  email: string | null;
  image: string | null;
  year: number;
  order: number;
  active: boolean;
}

const inputClass =
  "w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent";

export function MemberFormModal({ member }: { member?: Member }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(member?.name ?? "");
  const [role, setRole] = useState(member?.role ?? "부원");
  const [bio, setBio] = useState(member?.bio ?? "");
  const [github, setGithub] = useState(member?.github ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [image, setImage] = useState(member?.image ?? "");
  const [year, setYear] = useState(member?.year ?? new Date().getFullYear());
  const [order, setOrder] = useState(member?.order ?? 99);
  const [active, setActive] = useState(member?.active ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = { name, role, bio, github, email, image, year, order, active };
    const url = member ? `/api/admin/members/${member.id}` : "/api/admin/members";
    const method = member ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "오류가 발생했습니다.");
      setLoading(false);
      return;
    }

    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          member
            ? "p-1.5 text-zinc-600 hover:text-primary-400 rounded-lg hover:bg-zinc-800 transition-colors"
            : "btn-primary text-sm"
        }
      >
        {member ? <Edit size={14} /> : <><Plus size={16} /> 멤버 추가</>}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-white">
                {member ? "멤버 수정" : "멤버 추가"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-zinc-500 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-950/60 text-red-400 px-4 py-3 rounded-lg text-sm border border-red-800/50">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">이름 *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="홍길동"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">역할 *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={inputClass}
                  >
                    {["회장", "부회장", "개발팀장", "디자인팀장", "부원"].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">자기소개</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  placeholder="간단한 소개를 입력하세요"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">프로필 사진 URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">GitHub URL</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">이메일</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@gshs.app"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">입부년도 *</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    required
                    min={2020}
                    max={2030}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">표시 순서</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    min={0}
                    className={inputClass}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded accent-primary-600"
                />
                <span className="text-sm text-zinc-300">현재 활동 멤버</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors disabled:opacity-50 text-sm"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {member ? "수정하기" : "추가하기"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
