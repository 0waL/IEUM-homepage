import type { Metadata } from "next";
import { Code2, Users, Trophy, Heart, BookOpen, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "소개",
  description: "경남과학고 IT 동아리 이음(IEUM)을 소개합니다.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            이음(IEUM)이란?
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            연결하다, 잇다, 이음.
            <br />
            학교와 기술을 이어 더 나은 학교 생활을 만듭니다.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">우리의 미션</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                이음은 경남과학고 학생들이 직접 기획하고 개발한 서비스를 운영하는 IT 동아리입니다.
                우리는 실제로 사용되는 제품을 만들며 실전 경험을 쌓고,
                서로의 성장을 돕습니다.
              </p>
              <p className="text-gray-600 leading-relaxed">
                대표 프로젝트인 <strong>gshs.app</strong>은 경남과학고 학생들이 급식, 시간표,
                공지사항 등 학교 정보를 한 곳에서 확인할 수 있는 플랫폼으로,
                현재도 많은 학생들이 매일 사용하고 있습니다.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🔗</div>
              <blockquote className="text-primary-800 font-semibold text-lg italic">
                &ldquo;연결하다, 잇다, 이음&rdquo;
              </blockquote>
              <p className="text-primary-600 text-sm mt-2">
                기술로 사람과 사람을, 학교와 학생을 연결합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">핵심 가치</h2>
            <p className="text-gray-500">이음이 추구하는 것들</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Code2,
                title: "실전 경험",
                desc: "교과서 밖에서, 실제로 사용되는 서비스를 직접 만들며 배웁니다.",
                color: "text-blue-600 bg-blue-50",
              },
              {
                icon: Users,
                title: "팀워크",
                desc: "혼자가 아닌 팀으로, 서로의 강점을 모아 더 큰 것을 만듭니다.",
                color: "text-green-600 bg-green-50",
              },
              {
                icon: Trophy,
                title: "성장",
                desc: "스터디, 해커톤, 공모전을 통해 지속적으로 실력을 키워갑니다.",
                color: "text-yellow-600 bg-yellow-50",
              },
              {
                icon: Heart,
                title: "기여",
                desc: "우리가 만드는 서비스로 학교 구성원의 삶을 더 편리하게 만듭니다.",
                color: "text-red-600 bg-red-50",
              },
              {
                icon: BookOpen,
                title: "지식 공유",
                desc: "배운 것을 나누고, 함께 공부하며 집단 지성을 키웁니다.",
                color: "text-purple-600 bg-purple-50",
              },
              {
                icon: Zap,
                title: "도전",
                desc: "새로운 기술과 아이디어에 두려워하지 않고 도전합니다.",
                color: "text-orange-600 bg-orange-50",
              },
            ].map((item) => (
              <div key={item.title} className="card p-6">
                <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon size={22} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">기술 스택</h2>
            <p className="text-gray-500">이음이 사용하는 기술들</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "React", category: "Frontend" },
              { name: "Next.js", category: "Frontend" },
              { name: "TypeScript", category: "Language" },
              { name: "Tailwind CSS", category: "Styling" },
              { name: "Node.js", category: "Backend" },
              { name: "Prisma", category: "ORM" },
              { name: "PostgreSQL", category: "Database" },
              { name: "Figma", category: "Design" },
            ].map((tech) => (
              <div
                key={tech.name}
                className="card p-4 text-center hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-gray-900">{tech.name}</p>
                <p className="text-xs text-gray-400 mt-1">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">연혁</h2>
            <p className="text-gray-500">이음의 발자취</p>
          </div>
          <div className="space-y-6">
            {[
              { year: "2025", events: ["이음 동아리 공식 홈페이지 오픈", "gshs.app v2.0 출시"] },
              { year: "2024", events: ["gshs.app 리뉴얼 작업 시작", "교내 해커톤 참가", "신입부원 모집"] },
              { year: "2023", events: ["이음(IEUM) 동아리 창설", "gshs.app v1.0 개발 및 출시"] },
            ].map((item) => (
              <div key={item.year} className="flex gap-6">
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="text-primary-600 font-bold text-lg">{item.year}</span>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-3 h-3 bg-primary-600 rounded-full mt-1.5" />
                  <div className="w-0.5 bg-primary-200 flex-1 mt-1" />
                </div>
                <div className="flex-1 pb-6">
                  <ul className="space-y-2">
                    {item.events.map((event) => (
                      <li key={event} className="text-gray-600">
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
