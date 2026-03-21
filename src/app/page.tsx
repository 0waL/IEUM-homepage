import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Code2, Users, Lightbulb, ExternalLink, Zap } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { FadeIn } from "@/components/FadeIn";

export const revalidate = 60;

async function getRecentPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      author: { select: { name: true } },
      tags: { include: { tag: true } },
    },
  });
}

async function getStats() {
  const [memberCount, postCount] = await Promise.all([
    prisma.member.count({ where: { active: true } }),
    prisma.post.count({ where: { published: true } }),
  ]);
  return { memberCount, postCount };
}

export default async function HomePage() {
  const [posts, stats] = await Promise.all([getRecentPosts(), getStats()]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-950 min-h-[88vh] flex items-center">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary-700/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-primary-900/20 rounded-full blur-[120px]" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-950/60 border border-primary-800/50 rounded-full text-sm text-primary-300 mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
              경남과학고 IT 동아리
            </div>

            <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-[1.05] tracking-tighter">
              <span className="text-white">이음</span>
              <span className="block bg-gradient-to-r from-primary-400 via-primary-300 to-violet-300 bg-clip-text text-transparent text-5xl md:text-6xl font-bold mt-1">
                IEUM
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl">
              연결하다, 잇다, 이음.
              <br />
              학교와 기술을 잇는 경남과학고 IT 동아리입니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-500 transition-all duration-200 shadow-lg shadow-primary-900/40"
              >
                동아리 소개
                <ArrowRight size={18} />
              </Link>
              <a
                href="https://gshs.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-xl font-semibold hover:bg-zinc-700 transition-all duration-200"
              >
                gshs.app 방문
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: `${stats.memberCount}+`, label: "활동 멤버" },
              { value: `${stats.postCount}+`, label: "활동 기록" },
              { value: "1", label: "운영 서비스" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-28 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="section-title">우리가 하는 일</h2>
            <p className="section-subtitle">기술로 학교를 더 편리하게</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Code2,
                title: "서비스 개발",
                desc: "gshs.app을 포함한 학교 학생들을 위한 웹 서비스를 직접 기획하고 개발합니다. React, Next.js, Node.js 등 최신 기술 스택을 활용합니다.",
                gradient: "from-blue-500 to-cyan-500",
                glow: "group-hover:shadow-blue-900/40",
                delay: 0,
              },
              {
                icon: Users,
                title: "스터디 & 세미나",
                desc: "서로의 지식을 나누는 스터디와 세미나를 정기적으로 진행합니다. 개발, 디자인, 알고리즘 등 다양한 주제를 다룹니다.",
                gradient: "from-primary-500 to-violet-500",
                glow: "group-hover:shadow-primary-900/40",
                delay: 100,
              },
              {
                icon: Lightbulb,
                title: "해커톤 & 공모전",
                desc: "다양한 해커톤과 공모전에 참여해 실력을 키우고 팀워크를 다집니다. 외부 활동을 통해 시야를 넓힙니다.",
                gradient: "from-amber-500 to-orange-500",
                glow: "group-hover:shadow-orange-900/40",
                delay: 200,
              },
            ].map((item) => (
              <FadeIn key={item.title} delay={item.delay}>
              <div
                className="group card p-7 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 h-full"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg ${item.glow} transition-shadow`}
                >
                  <item.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Featured project */}
      <section className="py-28 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-zinc-700 bg-gradient-to-br from-primary-950 via-zinc-900 to-zinc-900">
            {/* Glow */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-700/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 text-primary-400 text-xs font-semibold uppercase tracking-widest mb-3">
                  <Zap size={12} />
                  대표 프로젝트
                </div>
                <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">gshs.app</h2>
                <p className="text-zinc-400 leading-relaxed mb-8 max-w-md">
                  경남과학고 학생들을 위한 종합 정보 플랫폼. 급식, 시간표, 공지사항 등
                  학생들이 필요한 모든 정보를 한 곳에서 확인할 수 있습니다.
                </p>
                <a
                  href="https://gshs.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-500 transition-all duration-200 shadow-lg shadow-primary-900/40"
                >
                  방문하기
                  <ExternalLink size={16} />
                </a>
              </div>
              <div className="flex-shrink-0">
                <div className="w-44 h-44 bg-zinc-800/60 rounded-2xl border border-zinc-700 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-white tracking-tight">gshs</div>
                    <div className="text-primary-400 text-sm mt-1 font-medium">.app</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* Recent posts */}
      {posts.length > 0 && (
        <section className="py-28 bg-zinc-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="flex items-end justify-between mb-12">
              <div>
                <h2 className="section-title">최근 활동</h2>
                <p className="section-subtitle">이음의 최신 소식</p>
              </div>
              <Link
                href="/activities"
                className="flex items-center gap-1.5 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
              >
                전체 보기
                <ArrowRight size={16} />
              </Link>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {posts.map((post, i) => (
                <FadeIn key={post.id} delay={i * 100}>
                  <PostCard post={post} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Join CTA */}
      <section className="py-28 bg-zinc-900 border-t border-zinc-800">
        <FadeIn className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            이음과 함께 만들어요
          </h2>
          <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
            개발에 관심 있는 경남과학고 학생이라면 누구든 환영합니다.
            <br />
            함께 더 나은 학교 서비스를 만들어봐요.
          </p>
          <Link
            href="/members"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-500 transition-all duration-200 shadow-lg shadow-primary-900/40 text-base"
          >
            멤버 보기
            <ArrowRight size={18} />
          </Link>
        </FadeIn>
      </section>
    </>
  );
}
