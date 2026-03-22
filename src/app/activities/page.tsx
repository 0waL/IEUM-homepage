import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "활동",
  description: "이음(IEUM)의 활동과 프로젝트를 소개합니다.",
};

export const revalidate = 60;

async function getPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      tags: { include: { tag: true } },
    },
  });
}

export default async function ActivitiesPage() {
  const posts = await getPosts();

  return (
    <div className="bg-navy-950 min-h-screen">
      {/* Header */}
      <section className="pt-36 pb-12 overflow-hidden relative">
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

      {/* Grid */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          {posts.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-zinc-600 text-lg">아직 게시글이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post, i) => (
                <FadeIn key={post.id} delay={(i % 3) * 80}>
                  <PostCard post={post} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
