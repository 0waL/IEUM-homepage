"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Github, Mail, Instagram, X, ChevronRight, Check } from "lucide-react";

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
  return gen === 1 ? "창립 멤버" : `${gen}기`;
}

function MemberModal({
  member,
  gradientIndex,
  onClose,
}: {
  member: MemberData;
  gradientIndex: number;
  onClose: () => void;
}) {
  const hasLinks = !!(member.github || member.instagram || member.email);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    if (!member.email) return;
    await navigator.clipboard.writeText(member.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-6"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/70" />

      {/* 모달 본체 */}
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "var(--modal-bg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        {/* ① 헤더: 사진 + 이름/기수/역할 */}
        <div className="flex items-center gap-6 p-7 pb-5">
          <div className="w-[130px] h-[130px] flex-shrink-0 rounded-2xl overflow-hidden border-2 border-white/20 bg-zinc-800 shadow-lg">
            <Avatar member={member} gradientIndex={gradientIndex} textSize="text-5xl" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs text-primary-400 font-semibold mb-2 tracking-widest uppercase">{genLabel(member.generation)}</p>
            <h2 className="text-4xl font-black text-white leading-tight mb-1.5">{member.name}</h2>
            <p className="text-zinc-400 text-base">{member.role}</p>
          </div>
        </div>

        <div className="mx-7 border-t border-white/8 mb-1" />

        <div className="px-7 pb-7 flex flex-col gap-4 mt-3">
          {/* ② 소갯말 */}
          {member.bio && (
            <div className="rounded-xl p-5" style={{ background: "var(--modal-section-1)" }}>
              <p className="text-xs font-bold text-zinc-400 mb-2.5 tracking-wide">소갯말</p>
              <p className="text-zinc-200 text-sm leading-relaxed">{member.bio}</p>
            </div>
          )}

          {/* ③ ETC */}
          {hasLinks && (
            <div className="rounded-xl p-5" style={{ background: "var(--modal-section-2)" }}>
              <p className="text-xs font-bold text-zinc-400 mb-4 tracking-wide">ETC</p>
              <div className="grid grid-cols-2 gap-x-10 gap-y-3.5">
                {member.github && (
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                    <span className="text-xs text-zinc-500 w-20 flex-shrink-0">Github</span>
                    <Github size={14} className="flex-shrink-0 text-zinc-400" />
                    <span className="text-primary-300 group-hover:underline text-xs truncate">
                      {member.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
                    </span>
                  </a>
                )}
                {member.instagram && (
                  <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                    <span className="text-xs text-zinc-500 w-20 flex-shrink-0">Instagram</span>
                    <Instagram size={14} className="flex-shrink-0 text-zinc-400" />
                    <span className="text-primary-300 group-hover:underline text-xs truncate">
                      {member.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")}
                    </span>
                  </a>
                )}
                {member.email && (
                  <button onClick={copyEmail} className="flex items-center gap-2 group col-span-2 text-left">
                    <span className="text-xs text-zinc-500 w-20 flex-shrink-0">Email</span>
                    {copied
                      ? <Check size={14} className="flex-shrink-0 text-green-400" />
                      : <Mail size={14} className="flex-shrink-0 text-zinc-400" />
                    }
                    <span className={`text-xs ${copied ? "text-green-400" : "text-primary-300 group-hover:underline"}`}>
                      {copied ? "복사됨!" : member.email}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {!member.bio && !hasLinks && (
            <p className="text-zinc-600 text-sm px-1">소개 정보가 없습니다.</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function MemberCard({ member, gradientIndex }: { member: MemberData; gradientIndex: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── 카드 ── */}
      <div className="bg-navy-900 border border-zinc-800 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-md flex">
        <div className="w-24 h-24 flex-shrink-0 bg-navy-800 overflow-hidden rounded-l-xl">
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

      {open && <MemberModal member={member} gradientIndex={gradientIndex} onClose={() => setOpen(false)} />}
    </>
  );
}
