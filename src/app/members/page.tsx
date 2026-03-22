import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Github, Mail } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

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
  if (gen === 0) return "창립 멤버 (0기)";
  return `${gen}기`;
}

export default async function MembersPage() {
  const members = await getAllMembers();

  // Group by generation
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
                      <div className="bg-navy-900 border border-white/8 rounded-xl p-4 text-center hover:border-white/15 transition-colors">
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

function MemberCard({
  member,
  gradientIndex,
}: {
  member: {
    id: string;
    name: string;
    role: string;
    bio: string | null;
    github: string | null;
    email: string | null;
    image: string | null;
    generation: number;
    active: boolean;
  };
  gradientIndex: number;
}) {
  const grad = gradients[gradientIndex % gradients.length];
  const link = member.github || (member.email ? `mailto:${member.email}` : null);

  return (
    <div className="bg-navy-900 border border-white/8 rounded-xl overflow-hidden hover:border-primary-600/40 transition-all duration-200 hover:-translate-y-0.5 flex">
      {/* Photo */}
      <div className="w-28 flex-shrink-0 bg-navy-800 overflow-hidden">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center text-white font-black text-3xl min-h-[100px]`}
          >
            {member.name[0]}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-bold text-white text-base truncate">{member.name}</h3>
          {member.bio ? (
            <p className="text-zinc-400 text-sm mt-0.5 line-clamp-2 leading-snug">{member.bio}</p>
          ) : (
            <p className="text-zinc-500 text-sm mt-0.5">{member.role}</p>
          )}
        </div>
        {link && (
          <a
            href={link}
            target={member.github ? "_blank" : undefined}
            rel={member.github ? "noopener noreferrer" : undefined}
            className="text-primary-400 text-sm hover:text-primary-300 transition-colors mt-2 inline-flex items-center gap-1"
          >
            {member.github ? <Github size={13} /> : <Mail size={13} />}
            자세히 보기
          </a>
        )}
      </div>
    </div>
  );
}
