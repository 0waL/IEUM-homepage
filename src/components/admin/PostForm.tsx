"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Eye, EyeOff, Upload, X } from "lucide-react";
import { renderMarkdown } from "@/lib/renderMarkdown";

interface PostFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    published: boolean;
    tags: string;
    coverImage?: string | null;
  };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const inputClass =
  "w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent";

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "활동");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [tags, setTags] = useState(initialData?.tags ?? "");
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (before: string, after = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.slice(start, end);
    const newContent =
      content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(newContent);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };
  const [coverImage, setCoverImage] = useState<string | null>(initialData?.coverImage ?? null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!initialData) {
      setSlug(slugify(value));
    }
  };

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload?folder=posts", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setCoverImage(data.url);
    }
    setImageUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const body = { title, slug, excerpt, content, category, published, tags: tagList, coverImage };

    const url = initialData
      ? `/api/admin/posts/${initialData.id}`
      : "/api/admin/posts";
    const method = initialData ? "PUT" : "POST";

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

    router.push("/admin/posts");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">제목 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="게시글 제목"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">슬러그 (URL) *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="my-post-url"
              className={`${inputClass} font-mono`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">요약 *</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
              rows={2}
              placeholder="게시글 요약 (목록에 표시됩니다)"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-zinc-400">내용 * (마크다운 지원)</label>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
              >
                {preview ? <EyeOff size={13} /> : <Eye size={13} />}
                {preview ? "편집" : "미리보기"}
              </button>
            </div>

            {/* 툴바 */}
            {!preview && (
              <div className="flex flex-wrap gap-1 mb-1.5">
                {[
                  { label: "H2", action: () => insertAtCursor("## ") },
                  { label: "H3", action: () => insertAtCursor("### ") },
                  { label: "B", action: () => insertAtCursor("**", "**") },
                  { label: "code", action: () => insertAtCursor("`", "`") },
                  { label: "```", action: () => insertAtCursor("```\n", "\n```") },
                  { label: "─────", action: () => insertAtCursor("\n---\n") },
                  { label: "- 목록", action: () => insertAtCursor("- ") },
                  { label: "1. 목록", action: () => insertAtCursor("1. ") },
                ].map(({ label, action }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={action}
                    className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded transition-colors font-mono"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {preview ? (
              <div className="w-full min-h-[400px] p-6 bg-zinc-800 border border-zinc-700 rounded-lg overflow-auto">
                <div>
                  {renderMarkdown(content)}
                </div>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={18}
                placeholder={"# 제목\n\n내용을 입력하세요.\n\n## 소제목\n\n- 목록 항목\n\n---\n\n구분선 아래 내용"}
                className={`${inputClass} font-mono`}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Publish */}
          <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4">
            <h3 className="font-semibold text-zinc-200 mb-3">발행 설정</h3>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-zinc-400">공개 여부</label>
              <button
                type="button"
                onClick={() => setPublished(!published)}
                className={`relative w-10 rounded-full transition-colors h-6 ${published ? "bg-primary-600" : "bg-zinc-600"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${published ? "translate-x-4" : ""}`}
                />
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors disabled:opacity-50 text-sm"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <Save size={14} />
              {initialData ? "수정하기" : "저장하기"}
            </button>
          </div>

          {/* Cover Image */}
          <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4">
            <h3 className="font-semibold text-zinc-200 mb-3">커버 이미지</h3>
            {coverImage ? (
              <div className="relative">
                <img
                  src={coverImage}
                  alt="커버 이미지"
                  className="w-full aspect-video object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
                className="w-full aspect-video flex flex-col items-center justify-center gap-2 bg-zinc-700/50 hover:bg-zinc-700 border-2 border-dashed border-zinc-600 rounded-lg transition-colors text-zinc-400 hover:text-zinc-200"
              >
                {imageUploading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Upload size={20} />
                    <span className="text-xs">클릭해서 이미지 업로드</span>
                  </>
                )}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
                e.target.value = "";
              }}
            />
            {coverImage && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
                className="mt-2 w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-1"
              >
                이미지 교체
              </button>
            )}
          </div>

          {/* Category */}
          <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4">
            <h3 className="font-semibold text-zinc-200 mb-3">카테고리</h3>
            <div className="space-y-2">
              {["활동", "프로젝트", "공지"].map((cat) => (
                <label key={cat} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                    className="text-primary-600 accent-primary-600"
                  />
                  <span className="text-sm text-zinc-300">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4">
            <h3 className="font-semibold text-zinc-200 mb-3">태그</h3>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Next.js, gshs.app, 개발"
              className={inputClass}
            />
            <p className="text-xs text-zinc-500 mt-1">쉼표로 구분하세요</p>
          </div>
        </div>
      </div>
    </form>
  );
}
