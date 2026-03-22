import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MessageSquare, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { DeleteInquiryButton } from "@/components/admin/DeleteInquiryButton";

export const revalidate = 0;

function timeAgo(date: Date) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export default async function AdminInquiriesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { comments: { select: { id: true } } },
  });

  const pending = inquiries.filter((i) => i.status === "pending").length;
  const answered = inquiries.filter((i) => i.status === "answered").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">문의 관리</h1>
          <p className="text-gray-500 text-sm mt-1">
            전체 {inquiries.length}건 · 대기중 {pending}건 · 답변완료 {answered}건
          </p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <MessageSquare className="mx-auto mb-3 text-gray-300" size={32} />
          <p className="text-gray-400">아직 문의가 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">상태</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">제목</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 hidden sm:table-cell">작성자</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 hidden md:table-cell">댓글</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 hidden md:table-cell">작성일</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    {inquiry.status === "answered" ? (
                      <CheckCircle2 size={16} className="text-primary-500" />
                    ) : (
                      <Clock size={16} className="text-gray-400" />
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">
                      {inquiry.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 sm:hidden">{inquiry.author}</p>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <p className="text-sm text-gray-600">{inquiry.author}</p>
                    {inquiry.email && (
                      <p className="text-xs text-gray-400">{inquiry.email}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-sm text-gray-500">{inquiry.comments.length}</span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-sm text-gray-400">{timeAgo(inquiry.createdAt)}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/inquiries/${inquiry.id}`}
                        target="_blank"
                        className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
                        title="답변하기"
                      >
                        <ExternalLink size={15} />
                      </Link>
                      <DeleteInquiryButton id={inquiry.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
