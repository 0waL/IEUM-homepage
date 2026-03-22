import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, ExternalLink, Code2, Users, Lightbulb } from "lucide-react";
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
      <section className="relative min-h-screen flex items-center bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-primary-700/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-primary-900/20 rounded-full blur-[140px]" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-20 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-950/60 border border-primary-800/50 rounded-full text-sm text-primary-300 mb-10">
            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
            경남과학고 IT 동아리
          </div>

          <h1
            className="font-black leading-none tracking-tighter text-white mb-6"
            style={{ fontSize: "clamp(5rem, 16vw, 16rem)" }}
          >
            IEUM
          </h1>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary-400 mb-4 tracking-tight">
                연결하다, 잇다, 이음.
              </p>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">
                학교와 기술을 잇는 경남과학고 IT 동아리입니다.
                <br />
                함께 만들고, 함께 성장합니다.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href="#about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-500 transition-all duration-200 shadow-lg shadow-primary-900/40"
              >
                소개 보기
                <ArrowRight size={16} />
              </a>
              <a
                href="https://gshs.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/15 text-zinc-300 rounded-full font-semibold hover:bg-white/5 transition-all duration-200"
              >
                gshs.app
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy-900 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-10">
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

      {/* About / Mission */}
      <section id="about" className="py-32 bg-navy-950">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">이음(IEUM)이란?</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                이음은 경남과학고 학생들이 직접 기획하고 개발한 서비스를 운영하는 IT 동아리입니다.
                우리는 실제로 사용되는 제품을 만들며 실전 경험을 쌓고, 서로의 성장을 돕습니다.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                대표 프로젝트인{" "}
                <strong className="text-primary-400 font-semibold">gshs.app</strong>은 경남과학고
                학생들이 급식, 시간표, 공지사항 등 학교 정보를 한 곳에서 확인할 수 있는 플랫폼으로,
                현재도 많은 학생들이 매일 사용하고 있습니다.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-950 to-navy-800 rounded-2xl border border-primary-900/40 p-10 text-center">
              <div className="text-6xl mb-5">🔗</div>
              <blockquote className="text-primary-300 font-semibold text-lg italic">
                &ldquo;연결하다, 잇다, 이음&rdquo;
              </blockquote>
              <p className="text-zinc-500 text-sm mt-3">기술로 사람과 사람을, 학교와 학생을 연결합니다</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What we do */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn className="mb-12">
            <h2 className="text-4xl font-extrabold text-white mb-3">우리가 하는 일</h2>
            <p className="text-zinc-400 text-lg">기술로 학교를 더 편리하게</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Code2,
                title: "서비스 개발",
                desc: "gshs.app을 포함한 학교 학생들을 위한 웹 서비스를 직접 기획하고 개발합니다.",
                gradient: "from-blue-500 to-cyan-500",
                delay: 0,
              },
              {
                icon: Users,
                title: "스터디 & 세미나",
                desc: "서로의 지식을 나누는 스터디와 세미나를 정기적으로 진행합니다.",
                gradient: "from-primary-500 to-violet-500",
                delay: 100,
              },
              {
                icon: Lightbulb,
                title: "해커톤 & 공모전",
                desc: "다양한 해커톤과 공모전에 참여해 실력을 키우고 팀워크를 다집니다.",
                gradient: "from-amber-500 to-orange-500",
                delay: 200,
              },
            ].map((item) => (
              <FadeIn key={item.title} delay={item.delay}>
                <div className="bg-navy-800 border border-white/8 rounded-2xl p-7 hover:border-primary-600/30 transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg`}>
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

      {/* Tech stack */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn className="mb-10">
            <h2 className="text-3xl font-extrabold text-white mb-2">기술 스택</h2>
            <p className="text-zinc-400">이음이 사용하는 기술들</p>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "React", category: "Frontend" },
              { name: "Next.js", category: "Frontend" },
              { name: "TypeScript", category: "Language" },
              { name: "Tailwind CSS", category: "Styling" },
              { name: "Node.js", category: "Backend" },
              { name: "Prisma", category: "ORM" },
              { name: "PostgreSQL", category: "Database" },
              { name: "Figma", category: "Design" },
            ].map((tech, i) => (
              <FadeIn key={tech.name} delay={(i % 4) * 60}>
                <div className="bg-navy-900 border border-white/8 rounded-xl p-4 text-center hover:border-primary-600/30 transition-all duration-200">
                  <p className="font-semibold text-white">{tech.name}</p>
                  <p className="text-xs text-zinc-500 mt-1">{tech.category}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Featured project */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <div className="relative overflow-hidden rounded-2xl border border-primary-800/40 bg-gradient-to-br from-primary-950/80 via-navy-800 to-navy-800">
              <div className="absolute top-0 left-0 w-72 h-72 bg-primary-700/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative p-10 md:p-16 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                  <p className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-4">대표 프로젝트</p>
                  <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">gshs.app</h2>
                  <p className="text-zinc-400 leading-relaxed mb-8 max-w-md">
                    경남과학고 학생들을 위한 종합 정보 플랫폼. 급식, 시간표, 공지사항 등
                    학생들이 필요한 모든 정보를 한 곳에서 확인할 수 있습니다.
                  </p>
                  <a
                    href="https://gshs.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/40"
                  >
                    방문하기
                    <ExternalLink size={15} />
                  </a>
                </div>
                <div className="flex-shrink-0 w-40 h-40 bg-navy-950/60 rounded-2xl border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-black text-white tracking-tighter">gshs</div>
                    <div className="text-primary-400 text-sm mt-1 font-medium">.app</div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Recent posts */}
      {posts.length > 0 && (
        <section className="py-24 bg-navy-950">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <FadeIn className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl font-extrabold text-white mb-2">최근 활동</h2>
                <p className="text-zinc-400 text-lg">이음의 최신 소식</p>
              </div>
              <Link
                href="/activities"
                className="flex items-center gap-1.5 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
              >
                전체 보기
                <ArrowRight size={16} />
              </Link>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      <section className="py-32 bg-navy-900 border-t border-white/5">
        <FadeIn className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <h2 className="text-5xl font-black text-white mb-5 tracking-tighter">
            이음과 함께<br />만들어요
          </h2>
          <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
            개발에 관심 있는 경남과학고 학생이라면 누구든 환영합니다.
          </p>
          <Link
            href="/members"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-500 transition-all duration-200 shadow-lg shadow-primary-900/40 text-base"
          >
            멤버 보기
            <ArrowRight size={18} />
          </Link>
        </FadeIn>
      </section>
    </>
  );
}
