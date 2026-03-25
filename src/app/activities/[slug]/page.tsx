import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { renderMarkdown } from "@/lib/renderMarkdown";

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
          <div className="mb-4">
            <span className="text-xs font-medium px-2.5 py-1 bg-primary-950/60 text-primary-400 border border-primary-800/50 rounded-full">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-zinc-400 text-lg leading-relaxed mb-5">
              {post.excerpt}
            </p>
          )}

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
