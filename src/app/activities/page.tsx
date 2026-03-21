import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";

export const metadata: Metadata = {
  title: "활동",
  description: "이음(IEUM)의 활동과 프로젝트를 소개합니다.",
};

export const revalidate = 60;

async function getPosts(category?: string) {
  return await prisma.post.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      tags: { include: { tag: true } },
    },
  });
}

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category;
  const posts = await getPosts(category);

  const categories = ["전체", "활동", "프로젝트", "공지"];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-zinc-950 py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary-800/15 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            활동 & 포트폴리오
          </h1>
          <p className="text-xl text-zinc-400">이음의 활동 기록과 프로젝트를 소개합니다</p>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800 sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => {
              const isActive = cat === "전체" ? !category : category === cat;
              return (
                <a
                  key={cat}
                  href={cat === "전체" ? "/activities" : `/activities?category=${cat}`}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-900/40"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {cat}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-zinc-600 text-lg">아직 게시글이 없습니다.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-zinc-600 mb-6">총 {posts.length}개의 게시글</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
