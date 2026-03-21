import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Code2, Users, Lightbulb, ExternalLink } from "lucide-react";
import { PostCard } from "@/components/PostCard";

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
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJWNDBoNHYtMkg2ek02IDRWMEg0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm mb-6 backdrop-blur-sm border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              경남과학고 IT 동아리
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              이음
              <span className="block text-primary-200 text-4xl md:text-5xl font-bold mt-2">
                IEUM
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
              연결하다, 잇다, 이음.
              <br />
              학교와 기술을 잇는 경남과학고 IT 동아리입니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
              >
                동아리 소개
                <ArrowRight size={18} />
              </Link>
              <a
                href="https://gshs.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                gshs.app 방문
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-4xl font-extrabold text-primary-600">{stats.memberCount}+</p>
              <p className="text-sm text-gray-500 mt-1">활동 멤버</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-primary-600">{stats.postCount}+</p>
              <p className="text-sm text-gray-500 mt-1">활동 기록</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-primary-600">1</p>
              <p className="text-sm text-gray-500 mt-1">운영 서비스</p>
            </div>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">우리가 하는 일</h2>
            <p className="section-subtitle">기술로 학교를 더 편리하게</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Code2,
                title: "서비스 개발",
                desc: "gshs.app을 포함한 학교 학생들을 위한 웹 서비스를 직접 기획하고 개발합니다. React, Next.js, Node.js 등 최신 기술 스택을 활용합니다.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: Users,
                title: "스터디 & 세미나",
                desc: "서로의 지식을 나누는 스터디와 세미나를 정기적으로 진행합니다. 개발, 디자인, 알고리즘 등 다양한 주제를 다룹니다.",
                color: "bg-green-50 text-green-600",
              },
              {
                icon: Lightbulb,
                title: "해커톤 & 공모전",
                desc: "다양한 해커톤과 공모전에 참여해 실력을 키우고 팀워크를 다집니다. 외부 활동을 통해 시야를 넓힙니다.",
                color: "bg-purple-50 text-purple-600",
              },
            ].map((item) => (
              <div key={item.title} className="card p-6 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured project */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl overflow-hidden">
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-white">
                <div className="text-primary-200 text-sm font-medium mb-2">대표 프로젝트</div>
                <h2 className="text-3xl font-extrabold mb-3">gshs.app</h2>
                <p className="text-primary-100 leading-relaxed mb-6">
                  경남과학고 학생들을 위한 종합 정보 플랫폼. 급식, 시간표, 공지사항 등
                  학생들이 필요한 모든 정보를 한 곳에서 확인할 수 있습니다.
                </p>
                <a
                  href="https://gshs.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  방문하기
                  <ExternalLink size={16} />
                </a>
              </div>
              <div className="flex-shrink-0">
                <div className="w-40 h-40 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-white">gshs</div>
                    <div className="text-primary-200 text-sm">.app</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent posts */}
      {posts.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="section-title">최근 활동</h2>
                <p className="section-subtitle">이음의 최신 소식</p>
              </div>
              <Link
                href="/activities"
                className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                전체 보기
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Join CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            이음과 함께 만들어요
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            개발에 관심 있는 경남과학고 학생이라면 누구든 환영합니다.
            <br />
            함께 더 나은 학교 서비스를 만들어봐요.
          </p>
          <Link href="/members" className="btn-primary text-base px-7 py-3">
            멤버 보기
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
