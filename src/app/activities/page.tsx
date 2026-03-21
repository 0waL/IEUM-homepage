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
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            활동 & 포트폴리오
          </h1>
          <p className="text-xl text-gray-500">이음의 활동 기록과 프로젝트를 소개합니다</p>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => {
              const isActive = cat === "전체" ? !category : category === cat;
              return (
                <a
                  key={cat}
                  href={cat === "전체" ? "/activities" : `/activities?category=${cat}`}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-400 text-lg">아직 게시글이 없습니다.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-6">총 {posts.length}개의 게시글</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
