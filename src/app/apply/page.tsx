import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { ClipboardList, Calendar, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "지원하기",
  description: "이음(IEUM) 동아리에 지원하세요.",
};

const STEPS = [
  {
    step: "01",
    title: "지원서 작성",
    desc: "아래 지원 폼에서 이름, 학년, 관심 분야, 지원 동기를 작성합니다.",
  },
  {
    step: "02",
    title: "서류 검토",
    desc: "부원들이 지원서를 검토하고 결과를 개인적으로 안내드립니다.",
  },
  {
    step: "03",
    title: "면접 및 최종 합격",
    desc: "간단한 면접 후 최종 합격자를 발표합니다. 합격 시 활동을 시작합니다.",
  },
];

const QUALIFICATIONS = [
  "경남과학고 재학생 누구나 지원 가능합니다.",
  "프로그래밍 경험이 없어도 의지와 열정이 있다면 환영합니다.",
  "팀워크를 중시하고 함께 성장하고 싶은 분을 찾습니다.",
  "웹·앱 개발, 디자인, 기획 등 다양한 분야를 모집합니다.",
];

export default async function ApplyPage() {
  const deadlineSetting = await prisma.siteContent.findUnique({ where: { key: "apply_deadline" } });
  const deadline = deadlineSetting?.value ?? "";

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-navy-950 pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-800/15 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-900/40 border border-primary-700/30 rounded-full text-primary-400 text-sm font-medium mb-6">
              <Calendar size={14} />
              {deadline ? `모집 기한: ${deadline}` : "신입부원 모집 중"}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
              이음에 합류하세요
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed">
              기술로 학교를 바꾸는 여정, 함께 시작하지 않겠어요?
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Qualifications */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-violet-500 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-white">지원 자격</h2>
            </div>
            <ul className="space-y-3">
              {QUALIFICATIONS.map((q, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-primary-400 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">{q}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <ClipboardList size={20} className="text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-white">지원 절차</h2>
            </div>
          </FadeIn>
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="flex gap-6 bg-navy-900 rounded-2xl p-7 border border-transparent hover:border-primary-600/30 transition-all duration-300">
                  <span className="text-4xl font-black text-primary-700 flex-shrink-0">{s.step}</span>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">{s.title}</h3>
                    <p className="text-zinc-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <div className="bg-gradient-to-br from-primary-950 to-navy-800 rounded-2xl border border-primary-900/40 p-12 text-center">
              <h2 className="text-3xl font-extrabold text-white mb-3">지금 바로 지원하세요</h2>
              <p className="text-zinc-400 mb-8">
                궁금한 점은 문의 게시판을 통해 언제든지 질문해주세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://forms.gle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-500 transition-colors"
                >
                  지원 폼 작성하기
                </a>
                <Link
                  href="/inquiries/new"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/5 text-zinc-300 rounded-full font-semibold hover:bg-white/10 transition-colors border border-white/10"
                >
                  문의하기
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
