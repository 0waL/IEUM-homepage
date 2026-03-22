"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, X, Loader2, Upload, Trash2 } from "lucide-react";

interface Member {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  github: string | null;
  instagram: string | null;
  email: string | null;
  image: string | null;
  generation: number;
  order: number;
  active: boolean;
}

const inputClass =
  "w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent";

export function MemberFormModal({ member }: { member?: Member }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(member?.name ?? "");
  const [role, setRole] = useState(member?.role ?? "부원");  // 대빵 | 부대빵 | 부원
  const [bio, setBio] = useState(member?.bio ?? "");
  const [github, setGithub] = useState(member?.github ?? "");
  const [instagram, setInstagram] = useState(member?.instagram ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [image, setImage] = useState(member?.image ?? "");
  const [generation, setGeneration] = useState(member?.generation ?? 0);
  const [order, setOrder] = useState(member?.order ?? 99);
  const [active, setActive] = useState(member?.active ?? true);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "업로드 실패");
      setImage(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = { name, role, bio, github, instagram, email, image, generation, order, active };
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
            ? "p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
            : "btn-primary text-sm"
        }
      >
        {member ? <Edit size={14} /> : <><Plus size={16} /> 멤버 추가</>}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-gray-900">
                {member ? "멤버 수정" : "멤버 추가"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">이름 *</label>
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
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">역할 *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={inputClass}
                  >
                    {["대빵", "부대빵", "부원"].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">자기소개</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  placeholder="간단한 소개를 입력하세요"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  프로필 사진 <span className="text-gray-400">(선택)</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {image ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={image}
                      alt="미리보기"
                      className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                    />
                    <div className="flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        <Upload size={12} />
                        {uploading ? "업로드 중..." : "변경"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setImage(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={12} />
                        삭제
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-2 h-20 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl text-gray-400 hover:text-gray-600 transition-colors text-sm"
                  >
                    <Upload size={16} />
                    {uploading ? "업로드 중..." : "클릭하여 이미지 업로드"}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">GitHub URL</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Instagram URL</label>
                  <input
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@gshs.app"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">기수 *</label>
                  <input
                    type="number"
                    value={generation}
                    onChange={(e) => setGeneration(Number(e.target.value))}
                    required
                    min={0}
                    placeholder="0 = 창립멤버"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">표시 순서</label>
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
                <span className="text-sm text-gray-700">현재 활동 멤버</span>
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
