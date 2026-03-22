"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "이음은 어떤 동아리인가요?",
    a: "이음(IEUM)은 경남과학고등학교 IT 동아리로, 학교와 기술을 연결하는 것을 목표로 합니다. 부원들이 직접 서비스를 기획하고 개발하며 실전 경험을 쌓습니다. 대표 프로젝트로 학생들이 매일 사용하는 gshs.app을 운영하고 있습니다.",
  },
  {
    q: "개발 경험이 없어도 지원할 수 있나요?",
    a: "네, 물론입니다! 코딩 실력보다 배우려는 의지와 열정이 더 중요합니다. 입부 후 스터디와 멘토링을 통해 함께 성장해나가니 걱정하지 않아도 됩니다.",
  },
  {
    q: "어떤 활동들을 하나요?",
    a: "gshs.app 서비스 개발 및 운영, 주기적인 스터디와 세미나, 교내외 해커톤 및 공모전 참가, 팀 프로젝트 등 다양한 활동을 진행합니다. 개발 외에도 디자인, 기획 등 다양한 역할이 있습니다.",
  },
  {
    q: "주로 어떤 기술 스택을 사용하나요?",
    a: "프론트엔드는 React, Next.js, TypeScript, Tailwind CSS를 주로 사용합니다. 백엔드는 Node.js, Prisma, PostgreSQL을 활용하며, 디자인 작업은 Figma로 진행합니다. 개인 프로젝트에서는 자유롭게 원하는 기술을 사용할 수 있습니다.",
  },
  {
    q: "신입 부원 모집은 언제 하나요?",
    a: "매년 신학기(3월)에 신입 부원을 모집합니다. 모집 공고는 학교 공지 및 이 홈페이지 활동 게시판을 통해 안내드립니다.",
  },
  {
    q: "개발팀과 디자인팀이 나뉘어져 있나요?",
    a: "별도로 팀이 나뉘어 있지는 않지만, 각자의 관심 분야에 맞게 역할을 분담합니다. 개발, 디자인, 기획 모두 환영하며, 팀 프로젝트를 통해 협업 경험을 쌓을 수 있습니다.",
  },
];

export function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-white/8 border-t border-white/8">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left gap-4 group"
          >
            <span className="text-white font-medium group-hover:text-primary-300 transition-colors">
              {faq.q}
            </span>
            <span className="flex-shrink-0 text-zinc-500 group-hover:text-primary-400 transition-colors">
              {open === i ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {open === i && (
            <div className="pb-5 text-zinc-400 text-sm leading-relaxed pr-8">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
