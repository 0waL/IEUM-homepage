import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import { TogglePublishButton } from "@/components/admin/TogglePublishButton";

export default async function AdminPostsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      tags: { include: { tag: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">게시글 관리</h1>
          <p className="text-gray-500 text-sm mt-1">총 {posts.length}개</p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          <Plus size={16} />
          새 게시글
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {posts.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p>게시글이 없습니다.</p>
            <Link href="/admin/posts/new" className="text-primary-600 text-sm hover:underline mt-2 inline-block">
              첫 게시글 작성하기
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">제목</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 hidden md:table-cell">카테고리</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 hidden md:table-cell">작성자</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 hidden md:table-cell">작성일</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">상태</th>
                <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">작업</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{post.title}</p>
                      <p className="text-xs text-gray-400 truncate max-w-xs">{post.excerpt}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-sm text-gray-500">{post.author.name}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-xs text-gray-400">
                      {format(new Date(post.createdAt), "yy.M.d", { locale: ko })}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <TogglePublishButton
                      postId={post.id}
                      published={post.published}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {post.published && (
                        <Link
                          href={`/activities/${post.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                        >
                          <Eye size={14} />
                        </Link>
                      )}
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50"
                      >
                        <Edit size={14} />
                      </Link>
                      <DeletePostButton postId={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
