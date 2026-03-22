"use client";

import { useState } from "react";
import { Github, Mail, Instagram, X, ChevronRight } from "lucide-react";

export interface MemberData {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  github: string | null;
  instagram: string | null;
  email: string | null;
  image: string | null;
  generation: number;
  active: boolean;
}

const gradients = [
  "from-violet-500 to-purple-700",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-primary-500 to-indigo-600",
];

function Avatar({
  member,
  gradientIndex,
  className = "w-full h-full",
  textSize = "text-3xl",
}: {
  member: MemberData;
  gradientIndex: number;
  className?: string;
  textSize?: string;
}) {
  const grad = gradients[gradientIndex % gradients.length];
  if (member.image) {
    return <img src={member.image} alt={member.name} className={`${className} object-cover`} />;
  }
  return (
    <div className={`${className} bg-gradient-to-br ${grad} flex items-center justify-center text-white font-black ${textSize}`}>
      {member.name[0]}
    </div>
  );
}

function genLabel(gen: number) {
  return gen === 0 ? "창립 멤버" : `${gen}기`;
}

export function MemberCard({ member, gradientIndex }: { member: MemberData; gradientIndex: number }) {
  const [open, setOpen] = useState(false);
  const hasLinks = !!(member.github || member.instagram || member.email);

  return (
    <>
      {/* ── 카드 ── */}
      <div className="bg-navy-900 border border-white/8 rounded-xl overflow-hidden hover:border-primary-600/40 transition-all duration-200 hover:-translate-y-0.5 flex">
        <div className="w-24 flex-shrink-0 bg-navy-800 overflow-hidden min-h-[88px]">
          <Avatar member={member} gradientIndex={gradientIndex} />
        </div>
        <div className="flex-1 px-4 py-3 flex flex-col justify-center min-w-0 gap-0.5">
          <h3 className="font-bold text-white text-base truncate">{member.name}</h3>
          <p className="text-zinc-500 text-sm">{genLabel(member.generation)}</p>
          <button
            onClick={() => setOpen(true)}
            className="mt-1.5 self-start flex items-center gap-0.5 text-primary-400 hover:text-primary-300 text-xs font-medium transition-colors"
          >
            자세히 보기
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* ── 모달 ── */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          {/* 반투명 배경 */}
          <div className="absolute inset-0 bg-black/60" />

          <div
            className="relative w-full max-w-[640px] rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "#1e1b3a" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>

            {/* ① 헤더: 사진 + 이름/기수/역할 */}
            <div className="flex items-center gap-5 p-6 pb-4">
              {/* 사진 – 둥근 네모 박스 + 테두리 */}
              <div className="w-[120px] h-[120px] flex-shrink-0 rounded-2xl overflow-hidden border-2 border-white/20 bg-zinc-800 shadow-lg">
                <Avatar member={member} gradientIndex={gradientIndex} textSize="text-5xl" />
              </div>

              {/* 텍스트 */}
              <div className="flex flex-col justify-center">
                <p className="text-xs text-primary-400 font-semibold mb-1.5 tracking-widest uppercase">{genLabel(member.generation)}</p>
                <h2 className="text-3xl font-black text-white leading-tight mb-1">{member.name}</h2>
                <p className="text-zinc-400 text-sm">{member.role}</p>
              </div>
            </div>

            <div className="mx-6 border-t border-white/8 mb-1" />

            <div className="px-6 pb-6 flex flex-col gap-3 mt-2">
              {/* ② 소갯말 */}
              {member.bio && (
                <div className="rounded-xl p-5" style={{ background: "#2a2550" }}>
                  <p className="text-xs font-bold text-zinc-400 mb-2.5 tracking-wide">소갯말</p>
                  <p className="text-zinc-200 text-sm leading-relaxed">{member.bio}</p>
                </div>
              )}

              {/* ③ ETC (링크) */}
              {hasLinks && (
                <div className="rounded-xl p-5" style={{ background: "#252240" }}>
                  <p className="text-xs font-bold text-zinc-400 mb-3.5 tracking-wide">ETC</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 group"
                      >
                        <span className="text-xs text-zinc-500 w-20 flex-shrink-0">Github</span>
                        <Github size={14} className="flex-shrink-0 text-zinc-400" />
                        <span className="text-primary-300 group-hover:underline text-xs truncate">
                          {member.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
                        </span>
                      </a>
                    )}
                    {member.instagram && (
                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 group"
                      >
                        <span className="text-xs text-zinc-500 w-20 flex-shrink-0">Instagram</span>
                        <Instagram size={14} className="flex-shrink-0 text-zinc-400" />
                        <span className="text-primary-300 group-hover:underline text-xs truncate">
                          {member.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")}
                        </span>
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 group col-span-2"
                      >
                        <span className="text-xs text-zinc-500 w-20 flex-shrink-0">Email</span>
                        <Mail size={14} className="flex-shrink-0 text-zinc-400" />
                        <span className="text-primary-300 group-hover:underline text-xs">{member.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* 소개도 링크도 없을 때 */}
              {!member.bio && !hasLinks && (
                <p className="text-zinc-600 text-sm px-1">소개 정보가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
