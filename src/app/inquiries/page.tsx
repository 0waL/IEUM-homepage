import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/FadeIn";
import { MessageSquare, CheckCircle2, Clock, PenLine } from "lucide-react";
import { InquiryDeleteButton } from "@/components/InquiryDeleteButton";

export const metadata: Metadata = {
  title: "문의",
  description: "이음(IEUM)에 궁금한 점을 질문해 주세요.",
};

export const revalidate = 0;

async function getInquiries() {
  return await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { comments: { select: { id: true } } },
  });
}

function timeAgo(date: Date) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export default async function InquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div className="bg-navy-950 min-h-screen">
      {/* Header */}
      <section className="pt-36 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-primary-800/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 sm:px-10">
          <FadeIn>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter">
                  문의 게시판
                </h1>
                <p className="text-zinc-400 text-lg">궁금한 점을 자유롭게 질문해 주세요.</p>
              </div>
              <Link
                href="/inquiries/new"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-full text-sm font-semibold transition-colors"
              >
                <PenLine size={15} />
                문의 작성
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* List */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          {inquiries.length === 0 ? (
            <div className="text-center py-32">
              <MessageSquare className="mx-auto mb-4 text-zinc-700" size={40} />
              <p className="text-zinc-600 text-lg">아직 문의가 없습니다.</p>
              <Link
                href="/inquiries/new"
                className="inline-block mt-4 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-full text-sm font-semibold transition-colors"
              >
                첫 번째로 질문하기
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {inquiries.map((inquiry, i) => (
                <FadeIn key={inquiry.id} delay={i * 40}>
                  <Link
                    href={`/inquiries/${inquiry.id}`}
                    className="group flex items-center gap-4 bg-navy-900 hover:bg-navy-800 border border-zinc-800 hover:border-zinc-700 rounded-2xl px-5 py-4 transition-all"
                  >
                    {/* Status icon */}
                    <div className="flex-shrink-0">
                      {inquiry.status === "answered" ? (
                        <CheckCircle2 size={20} className="text-primary-400" />
                      ) : (
                        <Clock size={20} className="text-zinc-600" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-100 font-medium truncate group-hover:text-primary-300 transition-colors">
                        {inquiry.title}
                      </p>
                      <p className="text-zinc-500 text-sm mt-0.5">
                        익명 · {timeAgo(inquiry.createdAt)}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          inquiry.status === "answered"
                            ? "bg-primary-900/50 text-primary-400"
                            : "bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {inquiry.status === "answered" ? "답변완료" : "대기중"}
                      </span>
                      {inquiry.comments.length > 0 && (
                        <span className="flex items-center gap-1 text-zinc-500 text-sm">
                          <MessageSquare size={13} />
                          {inquiry.comments.length}
                        </span>
                      )}
                      <InquiryDeleteButton inquiryId={inquiry.id} />
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
