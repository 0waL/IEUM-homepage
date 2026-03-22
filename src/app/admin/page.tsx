import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Users, Eye, Plus } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [totalPosts, publishedPosts, memberCount] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.member.count({ where: { active: true } }),
  ]);

  const recentPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { author: { select: { name: true } } },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-zinc-100">대시보드</h1>
        <p className="text-zinc-400 mt-1">안녕하세요, {session.user.name}님!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">전체 게시글</p>
              <p className="text-3xl font-extrabold text-zinc-100 mt-1">{totalPosts}</p>
            </div>
            <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">공개 게시글</p>
              <p className="text-3xl font-extrabold text-zinc-100 mt-1">{publishedPosts}</p>
            </div>
            <div className="w-11 h-11 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Eye size={20} className="text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">활동 멤버</p>
              <p className="text-3xl font-extrabold text-zinc-100 mt-1">{memberCount}</p>
            </div>
            <div className="w-11 h-11 bg-primary-500/10 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <h2 className="font-bold text-zinc-100 mb-4">빠른 작업</h2>
          <div className="space-y-2">
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
                <Plus size={16} className="text-primary-400" />
              </div>
              <span className="text-sm font-medium text-zinc-300">새 게시글 작성</span>
            </Link>
            <Link
              href="/admin/members"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
                <Users size={16} className="text-primary-400" />
              </div>
              <span className="text-sm font-medium text-zinc-300">멤버 관리</span>
            </Link>
          </div>
        </div>

        {/* Recent posts */}
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-zinc-100">최근 게시글</h2>
            <Link href="/admin/posts" className="text-xs text-primary-400 hover:underline">
              전체 보기
            </Link>
          </div>
          <div className="space-y-2">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}/edit`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{post.title}</p>
                  <p className="text-xs text-zinc-500">{post.author.name}</p>
                </div>
                <span
                  className={`flex-shrink-0 ml-2 text-xs px-2 py-0.5 rounded-full ${
                    post.published
                      ? "bg-green-500/15 text-green-400"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {post.published ? "공개" : "임시저장"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
