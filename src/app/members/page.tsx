import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/FadeIn";
import { MemberCard } from "@/components/MemberCard";

export const metadata: Metadata = {
  title: "멤버",
  description: "이음(IEUM) 동아리 멤버를 소개합니다.",
};

export const revalidate = 60;

const gradients = [
  "from-violet-500 to-purple-700",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-primary-500 to-indigo-600",
];

async function getAllMembers() {
  return await prisma.member.findMany({
    orderBy: [{ generation: "asc" }, { order: "asc" }],
  });
}

function generationLabel(gen: number) {
  if (gen === 1) return "창립 멤버 (1기)";
  return `${gen}기`;
}

export default async function MembersPage() {
  const members = await getAllMembers();

  const byGen = members.reduce<Record<number, typeof members>>((acc, m) => {
    if (!acc[m.generation]) acc[m.generation] = [];
    acc[m.generation].push(m);
    return acc;
  }, {});
  const generations = Object.keys(byGen).map(Number).sort((a, b) => a - b);

  const activeGens = generations.filter((g) => byGen[g].some((m) => m.active));
  const alumniGens = generations.filter((g) => byGen[g].every((m) => !m.active));

  return (
    <div className="bg-navy-950 min-h-screen">
      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[400px] bg-primary-800/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
              멤버 소개
            </h1>
            <p className="text-zinc-400 text-xl">이음을 빛낼 자랑스러운 멤버들을 소개합니다.</p>
          </FadeIn>
        </div>
      </section>

      {/* Active members by generation */}
      {activeGens.map((gen) => (
        <section key={gen} className="py-12 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <FadeIn>
              <h2 className="text-2xl font-bold text-white mb-1">
                {generationLabel(gen)}
              </h2>
              {gen === 0 && (
                <p className="text-zinc-500 text-sm mb-6">이음을 처음 만든 멤버들</p>
              )}
            </FadeIn>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${gen === 0 ? "" : "mt-6"}`}>
              {byGen[gen].map((member, i) => (
                <FadeIn key={member.id} delay={(i % 3) * 80}>
                  <MemberCard member={member} gradientIndex={i} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Alumni */}
      {alumniGens.length > 0 && (
        <section className="py-16 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <FadeIn>
              <h2 className="text-2xl font-bold text-white mb-2">졸업 멤버</h2>
              <p className="text-zinc-500 mb-8">이음을 함께 이끌었던 선배들</p>
            </FadeIn>
            {alumniGens.map((gen) => (
              <div key={gen} className="mb-8">
                <p className="text-sm text-zinc-600 font-semibold mb-3">{generationLabel(gen)}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {byGen[gen].map((member, i) => (
                    <FadeIn key={member.id} delay={(i % 4) * 60}>
                      <div className="bg-navy-900 border border-zinc-800 rounded-xl p-4 text-center hover:border-zinc-700 transition-colors">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${gradients[i % gradients.length]} rounded-lg flex items-center justify-center text-white font-bold mx-auto mb-2 text-sm`}
                        >
                          {member.name[0]}
                        </div>
                        <p className="font-semibold text-zinc-300 text-sm">{member.name}</p>
                        <p className="text-xs text-zinc-600 mt-0.5">{member.role}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Join */}
      <section className="py-24 border-t border-white/5">
        <FadeIn className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">함께하고 싶으신가요?</h2>
          <p className="text-zinc-400 leading-relaxed">
            매년 신입부원을 모집합니다. 개발, 디자인, 기획 등 다양한 분야에서
            <br />
            함께할 경남과학고 학생을 기다립니다.
          </p>
        </FadeIn>
      </section>
    </div>
  );
}
