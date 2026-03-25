import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ArrowLeft, Calendar, User } from "lucide-react";

interface Props {
  params: { slug: string };
}

async function getPost(slug: string) {
  return await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      author: { select: { name: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt };
}

function applyInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 text-primary-300 px-1.5 py-0.5 rounded text-[0.875em] font-mono">$1</code>');
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* ── 코드 블록 ── */
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={`code-${i}`} className="my-6 rounded-xl overflow-hidden border border-white/10">
          {lang && (
            <div className="px-4 py-2 bg-zinc-900 border-b border-white/10 text-xs text-zinc-500 font-mono">
              {lang}
            </div>
          )}
          <pre className="bg-[#0d0d14] p-5 overflow-x-auto">
            <code className="text-sm text-zinc-200 font-mono leading-relaxed">
              {codeLines.join("\n")}
            </code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    /* ── 제목 ── */
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-3xl font-extrabold text-white mt-14 mb-4 first:mt-0"
          dangerouslySetInnerHTML={{ __html: applyInline(line.slice(2)) }} />
      );
      i++; continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl font-bold text-white mt-12 mb-3 pb-2.5 border-b border-white/10"
          dangerouslySetInnerHTML={{ __html: applyInline(line.slice(3)) }} />
      );
      i++; continue;
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-semibold text-zinc-100 mt-10 mb-2"
          dangerouslySetInnerHTML={{ __html: applyInline(line.slice(4)) }} />
      );
      i++; continue;
    }

    /* ── 비순서 목록 ── */
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-4 pl-5 space-y-1.5">
          {items.map((item, j) => (
            <li key={j} className="text-zinc-300 leading-relaxed list-disc marker:text-primary-500"
              dangerouslySetInnerHTML={{ __html: applyInline(item) }} />
          ))}
        </ul>
      );
      continue;
    }

    /* ── 순서 목록 ── */
    if (line.match(/^\d+\. /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-4 pl-5 space-y-1.5">
          {items.map((item, j) => (
            <li key={j} className="text-zinc-300 leading-relaxed list-decimal marker:text-primary-500"
              dangerouslySetInnerHTML={{ __html: applyInline(item) }} />
          ))}
        </ol>
      );
      continue;
    }

    /* ── 빈 줄 ── */
    if (line.trim() === "") {
      i++;
      continue;
    }

    /* ── 일반 단락 ── */
    elements.push(
      <p key={i} className="text-zinc-300 leading-[1.85] my-3 text-[15px]"
        dangerouslySetInnerHTML={{ __html: applyInline(line) }} />
    );
    i++;
  }

  return elements;
}

export default async function PostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-navy-950 pt-24">
      {/* 뒤로가기 */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/activities"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft size={15} />
          목록으로
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* 헤더 */}
        <header className="mb-8">
          {/* 카테고리 */}
          <div className="mb-4">
            <span className="text-xs font-medium px-2.5 py-1 bg-primary-950/60 text-primary-400 border border-primary-800/50 rounded-full">
              {post.category}
            </span>
          </div>

          {/* 제목 */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
            {post.title}
          </h1>

          {/* 부제목 */}
          {post.excerpt && (
            <p className="text-zinc-400 text-lg leading-relaxed mb-5">
              {post.excerpt}
            </p>
          )}

          {/* 메타 */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 border-t border-white/8 pt-4">
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {post.author.name}
            </span>
            <span className="text-zinc-700">·</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {format(new Date(post.createdAt), "yyyy년 M월 d일", { locale: ko })}
            </span>
            {post.tags.length > 0 && (
              <>
                <span className="text-zinc-700">·</span>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map(({ tag }) => (
                    <span
                      key={tag.name}
                      className="px-2 py-0.5 bg-white/5 border border-white/10 text-zinc-500 rounded-full text-xs"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        {/* 본문 */}
        <div className="bg-navy-900/60 rounded-2xl px-8 py-8 border border-white/8">
          <div className="space-y-1">
            {renderMarkdown(post.content)}
          </div>
        </div>
      </article>
    </div>
  );
}
