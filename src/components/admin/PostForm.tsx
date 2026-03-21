"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";

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
  };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!initialData) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const body = { title, slug, excerpt, content, category, published, tags: tagList };

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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">제목 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="게시글 제목"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">슬러그 (URL) *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="my-post-url"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">요약 *</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
              rows={2}
              placeholder="게시글 요약 (목록에 표시됩니다)"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700">내용 * (마크다운 지원)</label>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900"
              >
                {preview ? <EyeOff size={13} /> : <Eye size={13} />}
                {preview ? "편집" : "미리보기"}
              </button>
            </div>
            {preview ? (
              <div className="w-full min-h-[400px] p-4 border border-gray-200 rounded-lg bg-white prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">{content}</pre>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={18}
                placeholder="# 제목&#10;&#10;내용을 입력하세요. 마크다운 형식을 지원합니다."
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Publish */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">발행 설정</h3>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-gray-600">공개 여부</label>
              <button
                type="button"
                onClick={() => setPublished(!published)}
                className={`relative w-10 h-5.5 rounded-full transition-colors ${published ? "bg-primary-600" : "bg-gray-200"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${published ? "translate-x-4.5" : ""}`}
                />
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <Save size={14} />
              {initialData ? "수정하기" : "저장하기"}
            </button>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">카테고리</h3>
            <div className="space-y-2">
              {["활동", "프로젝트", "공지"].map((cat) => (
                <label key={cat} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                    className="text-primary-600"
                  />
                  <span className="text-sm text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">태그</h3>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Next.js, gshs.app, 개발"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">쉼표로 구분하세요</p>
          </div>
        </div>
      </div>
    </form>
  );
}
