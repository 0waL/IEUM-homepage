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

const roleColors: Record<string, string> = {
  회장: "bg-yellow-50 text-yellow-700 border-yellow-200",
  부회장: "bg-orange-50 text-orange-700 border-orange-200",
  개발팀장: "bg-blue-50 text-blue-700 border-blue-200",
  디자인팀장: "bg-purple-50 text-purple-700 border-purple-200",
  부원: "bg-gray-50 text-gray-600 border-gray-200",
};

export default async function MembersPage() {
  const [members, alumni] = await Promise.all([getMembers(), getAlumni()]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">멤버 소개</h1>
          <p className="text-xl text-gray-500">이음을 만들어가는 사람들</p>
        </div>
      </section>

      {/* Active members */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">현재 멤버</h2>
          {members.length === 0 ? (
            <p className="text-gray-400 text-center py-12">멤버 정보가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
                <div key={member.id} className="card p-6">
                  {/* Avatar */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {member.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                      <span
                        className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border mt-1 ${roleColors[member.role] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}
                      >
                        {member.role}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{member.year}년 입부</p>
                    </div>
                  </div>
                  {member.bio && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{member.bio}</p>
                  )}
                  <div className="flex items-center gap-3">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        <Github size={14} />
                        GitHub
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
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
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">졸업 멤버</h2>
            <p className="text-gray-500 mb-8">이음을 함께 이끌었던 선배들</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {alumni.map((member) => (
                <div key={member.id} className="card p-4 text-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold mx-auto mb-2">
                    {member.name[0]}
                  </div>
                  <p className="font-semibold text-gray-700 text-sm">{member.name}</p>
                  <p className="text-xs text-gray-400">{member.role}</p>
                  <p className="text-xs text-gray-400">{member.year}년</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Join */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">함께하고 싶으신가요?</h2>
          <p className="text-gray-500 leading-relaxed">
            매년 신입부원을 모집합니다. 개발, 디자인, 기획 등 다양한 분야에서
            <br />
            함께할 경기과학고 학생을 기다립니다.
          </p>
        </div>
      </section>
    </div>
  );
}
