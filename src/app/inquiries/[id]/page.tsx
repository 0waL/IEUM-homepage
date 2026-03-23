import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { InquiryCommentSection } from "@/components/InquiryCommentSection";

export const revalidate = 0;

async function getInquiry(id: string) {
  return await prisma.inquiry.findUnique({
    where: { id },
    include: {
      comments: {
        include: { user: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function InquiryDetailPage({ params }: { params: { id: string } }) {
  const inquiry = await getInquiry(params.id);
  if (!inquiry) notFound();

  return (
    <div className="bg-navy-950 min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 sm:px-10">
        <Link
          href="/inquiries"
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          문의 목록
        </Link>

        {/* Inquiry */}
        <div className="bg-navy-900/60 border border-white/8 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <span
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 mt-0.5 ${
                inquiry.status === "answered"
                  ? "bg-primary-900/50 text-primary-400"
                  : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {inquiry.status === "answered" ? (
                <CheckCircle2 size={11} />
              ) : (
                <Clock size={11} />
              )}
              {inquiry.status === "answered" ? "답변완료" : "대기중"}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">{inquiry.title}</h1>

          <div className="flex items-center gap-3 text-zinc-500 text-sm mb-6 pb-6 border-b border-white/5">
            <span>익명</span>
            <span>·</span>
            <span>{formatDate(inquiry.createdAt)}</span>
          </div>

          <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-sm">
            {inquiry.content}
          </div>
        </div>

        {/* Comments */}
        <InquiryCommentSection
          inquiryId={inquiry.id}
          comments={inquiry.comments.map((c) => ({
            id: c.id,
            content: c.content,
            createdAt: c.createdAt,
            user: c.user,
          }))}
        />
      </div>
    </div>
  );
}
