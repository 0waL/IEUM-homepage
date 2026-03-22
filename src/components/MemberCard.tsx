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
    return (
      <img
        src={member.image}
        alt={member.name}
        className={`${className} object-cover`}
      />
    );
  }
  return (
    <div
      className={`${className} bg-gradient-to-br ${grad} flex items-center justify-center text-white font-black ${textSize}`}
    >
      {member.name[0]}
    </div>
  );
}

export function MemberCard({
  member,
  gradientIndex,
}: {
  member: MemberData;
  gradientIndex: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Card */}
      <div className="bg-navy-900 border border-white/8 rounded-xl overflow-hidden hover:border-primary-600/40 transition-all duration-200 hover:-translate-y-0.5 flex">
        {/* Photo */}
        <div className="w-24 flex-shrink-0 bg-navy-800 overflow-hidden min-h-[80px]">
          <Avatar member={member} gradientIndex={gradientIndex} />
        </div>

        {/* Info */}
        <div className="flex-1 px-4 py-3 flex flex-col justify-center min-w-0 gap-0.5">
          <h3 className="font-bold text-white text-base truncate">{member.name}</h3>
          <p className="text-zinc-500 text-sm">
            {member.generation === 0 ? "창립 멤버" : `${member.generation}기`}
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-1.5 self-start flex items-center gap-0.5 text-primary-400 hover:text-primary-300 text-xs font-medium transition-colors"
          >
            자세히 보기
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-navy-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 p-1.5 text-zinc-500 hover:text-zinc-200 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Profile header */}
            <div className="flex items-center gap-4 p-6 pb-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <Avatar member={member} gradientIndex={gradientIndex} textSize="text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">{member.name}</h2>
                <p className="text-zinc-400 text-sm mt-0.5">
                  {member.generation === 0 ? "창립 멤버" : `${member.generation}기`}
                  {member.role && <span className="ml-2 text-zinc-500">· {member.role}</span>}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-6 border-t border-white/8" />

            {/* Bio */}
            {member.bio && (
              <div className="px-6 py-4">
                <p className="text-zinc-300 text-sm leading-relaxed">{member.bio}</p>
              </div>
            )}

            {/* Links */}
            {(member.github || member.instagram || member.email) && (
              <div className="px-6 pb-6 flex flex-wrap gap-2">
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    <Github size={13} />
                    GitHub
                  </a>
                )}
                {member.instagram && (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    <Instagram size={13} />
                    Instagram
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    <Mail size={13} />
                    이메일
                  </a>
                )}
              </div>
            )}

            {/* No bio & no links */}
            {!member.bio && !member.github && !member.instagram && !member.email && (
              <div className="px-6 pb-6">
                <p className="text-zinc-600 text-sm">소개 정보가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
