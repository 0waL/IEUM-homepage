import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Github, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "멤버",
  description: "이음(IEUM) 동아리 멤버를 소개합니다.",
};

export const revalidate = 60;

async function getMembers() {
  return await prisma.member.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
}

async function getAlumni() {
  return await prisma.member.findMany({
    where: { active: false },
    orderBy: { year: "desc" },
  });
}

const roleGradients: Record<string, string> = {
  회장: "from-amber-400 to-orange-500",
  부회장: "from-orange-400 to-red-500",
  개발팀장: "from-blue-400 to-cyan-500",
  디자인팀장: "from-primary-400 to-violet-500",
  부원: "from-zinc-400 to-zinc-600",
};

const roleBadge: Record<string, string> = {
  회장: "bg-amber-950/60 text-amber-400 border-amber-800/50",
  부회장: "bg-orange-950/60 text-orange-400 border-orange-800/50",
  개발팀장: "bg-blue-950/60 text-blue-400 border-blue-800/50",
  디자인팀장: "bg-primary-950/60 text-primary-400 border-primary-800/50",
  부원: "bg-zinc-800/60 text-zinc-400 border-zinc-700/50",
};

export default async function MembersPage() {
  const [members, alumni] = await Promise.all([getMembers(), getAlumni()]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-zinc-950 py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary-800/15 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">멤버 소개</h1>
          <p className="text-xl text-zinc-400">이음을 만들어가는 사람들</p>
        </div>
      </section>

      {/* Active members */}
      <section className="py-20 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-white mb-8">현재 멤버</h2>
          {members.length === 0 ? (
            <p className="text-zinc-600 text-center py-12">멤버 정보가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {members.map((member) => (
                <div key={member.id} className="card p-6 hover:border-zinc-700 transition-all duration-300">
                  {/* Avatar */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${roleGradients[member.role] ?? "from-zinc-500 to-zinc-700"} rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg`}
                    >
                      {member.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{member.name}</h3>
                      <span
                        className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border mt-1 ${roleBadge[member.role] ?? "bg-zinc-800/60 text-zinc-400 border-zinc-700/50"}`}
                      >
                        {member.role}
                      </span>
                      <p className="text-xs text-zinc-600 mt-1">{member.year}년 입부</p>
                    </div>
                  </div>
                  {member.bio && (
                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">{member.bio}</p>
                  )}
                  <div className="flex items-center gap-3">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
                      >
                        <Github size={14} />
                        GitHub
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
                      >
                        <Mail size={14} />
                        {member.email}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Alumni */}
      {alumni.length > 0 && (
        <section className="py-20 bg-zinc-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-white mb-2">졸업 멤버</h2>
            <p className="text-zinc-500 mb-8">이음을 함께 이끌었던 선배들</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {alumni.map((member) => (
                <div key={member.id} className="card p-4 text-center hover:border-zinc-700 transition-colors">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 font-bold mx-auto mb-2">
                    {member.name[0]}
                  </div>
                  <p className="font-semibold text-zinc-300 text-sm">{member.name}</p>
                  <p className="text-xs text-zinc-600">{member.role}</p>
                  <p className="text-xs text-zinc-600">{member.year}년</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Join */}
      <section className="py-20 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">함께하고 싶으신가요?</h2>
          <p className="text-zinc-400 leading-relaxed">
            매년 신입부원을 모집합니다. 개발, 디자인, 기획 등 다양한 분야에서
            <br />
            함께할 경남과학고 학생을 기다립니다.
          </p>
        </div>
      </section>
    </div>
  );
}
