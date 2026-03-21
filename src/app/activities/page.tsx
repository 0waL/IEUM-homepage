import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "활동",
  description: "이음(IEUM)의 활동과 프로젝트를 소개합니다.",
};

export const revalidate = 60;

async function getPosts(tag?: string, category?: string) {
  return await prisma.post.findMany({
    where: {
      published: true,
      ...(tag ? { tags: { some: { tag: { name: tag } } } } : {}),
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      tags: { include: { tag: true } },
    },
  });
}

async function getAllTags() {
  return await prisma.tag.findMany({
    where: { posts: { some: { post: { published: true } } } },
    orderBy: { name: "asc" },
  });
}

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: { tag?: string; category?: string };
}) {
  const [posts, tags] = await Promise.all([
    getPosts(searchParams.tag, searchParams.category),
    getAllTags(),
  ]);

  const categories = ["활동", "프로젝트", "공지"];
  const activeTag = searchParams.tag;
  const activeCategory = searchParams.category;
  const isAll = !activeTag && !activeCategory;

  return (
    <div className="bg-navy-950 min-h-screen">
      {/* Hero */}
      <section className="relative pt-36 pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/3 w-[500px] h-[300px] bg-primary-800/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
              활동 & 포트폴리오
            </h1>
            <p className="text-zinc-400 text-xl">이음 부원들이 제작한 프로젝트를 소개합니다.</p>
          </FadeIn>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-4 z-40 flex justify-center px-4 mb-8">
        <div className="bg-navy-900/95 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2.5 flex items-center gap-1.5 flex-wrap shadow-xl shadow-black/30 max-w-full overflow-x-auto">
          <a
            href="/activities"
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              isAll
                ? "bg-primary-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            전체
          </a>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`/activities?category=${cat}`}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat}
            </a>
          ))}
          {tags.length > 0 && (
            <>
              <div className="w-px h-5 bg-white/10 mx-1 flex-shrink-0" />
              {tags.map((tag) => (
                <a
                  key={tag.id}
                  href={`/activities?tag=${tag.name}`}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeTag === tag.name
                      ? "bg-white/15 text-white border border-white/20"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  {tag.name}
                </a>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Posts grid */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          {posts.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-zinc-600 text-lg">게시글이 없습니다.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-zinc-600 mb-6">총 {posts.length}개</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post, i) => (
                  <FadeIn key={post.id} delay={(i % 3) * 80}>
                    <PostCard post={post} />
                  </FadeIn>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
