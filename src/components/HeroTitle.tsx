"use client";

import { useEffect, useState } from "react";

const CHARS_KO = ["이", "음"];
const CHARS_EN = ["I", "E", "U", "M"];

export function HeroTitle() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 살짝 딜레이 후 시작 (페이지 로드 후 자연스럽게)
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <h1 className="font-black leading-[0.88] tracking-tighter mb-8">
      {/* 이음 */}
      <span
        className="block text-white overflow-hidden"
        style={{ fontSize: "clamp(3.5rem, 11vw, 13rem)" }}
      >
        {CHARS_KO.map((char, i) => (
          <span
            key={i}
            className="inline-block"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(0.15em)",
              transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${80 + i * 120}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${80 + i * 120}ms`,
            }}
          >
            {char}
          </span>
        ))}
      </span>

      {/* IEUM */}
      <span
        className="block text-primary-400 overflow-hidden"
        style={{ fontSize: "clamp(2.5rem, 8vw, 9rem)" }}
      >
        {CHARS_EN.map((char, i) => (
          <span
            key={i}
            className="inline-block"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(0.2em)",
              transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${320 + i * 80}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${320 + i * 80}ms`,
            }}
          >
            {char}
          </span>
        ))}
      </span>
    </h1>
  );
}
