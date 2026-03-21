import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

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
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  // Simple markdown-like renderer (basic)
  const lines = post.content.split("\n");
  const renderedLines = lines.map((line, i) => {
    if (line.startsWith("# ")) return <h1 key={i} className="text-3xl font-extrabold text-gray-900 mt-8 mb-4">{line.slice(2)}</h1>;
    if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{line.slice(3)}</h2>;
    if (line.startsWith("### ")) return <h3 key={i} className="text-xl font-bold text-gray-900 mt-4 mb-2">{line.slice(4)}</h3>;
    if (line.startsWith("- ")) return <li key={i} className="text-gray-700 ml-4 list-disc">{line.slice(2)}</li>;
    if (line.match(/^\d+\. /)) return <li key={i} className="text-gray-700 ml-4 list-decimal">{line.replace(/^\d+\. /, "")}</li>;
    if (line.startsWith("```")) return <div key={i} className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm my-4 overflow-x-auto" />;
    if (line === "") return <br key={i} />;
    // Bold
    const boldLine = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return <p key={i} className="text-gray-700 leading-relaxed my-2" dangerouslySetInnerHTML={{ __html: boldLine }} />;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/activities"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            목록으로
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full">
              {post.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {post.title}
          </h1>
          <p className="text-gray-500 text-lg mb-6">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 border-t border-gray-100 pt-4">
            <span className="flex items-center gap-1.5">
              <User size={15} />
              {post.author.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={15} />
              {format(new Date(post.createdAt), "yyyy년 M월 d일", { locale: ko })}
            </span>
            {post.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag size={15} />
                {post.tags.map(({ tag }) => (
                  <span key={tag.name} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="prose max-w-none">
            {renderedLines}
          </div>
        </div>
      </article>
    </div>
  );
}
