import React from "react";

export function applyInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 text-primary-300 px-1.5 py-0.5 rounded text-[0.875em] font-mono">$1</code>');
}

function isSpecialLine(line: string): boolean {
  return (
    line.startsWith("```") ||
    line.trim() === "---" ||
    line.startsWith("# ") ||
    line.startsWith("## ") ||
    line.startsWith("### ") ||
    line.startsWith("- ") ||
    line.startsWith("* ") ||
    /^\d+\. /.test(line) ||
    line.trim() === ""
  );
}

export function renderMarkdown(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* ── 코드 블록 ── */
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={`code-${i}`} className="my-6 rounded-xl overflow-hidden border border-white/10">
          {lang && (
            <div className="px-4 py-2 bg-zinc-900 border-b border-white/10 text-xs text-zinc-500 font-mono">
              {lang}
            </div>
          )}
          <pre className="bg-[#0d0d14] p-5 overflow-x-auto">
            <code className="text-sm text-zinc-200 font-mono leading-relaxed">
              {codeLines.join("\n")}
            </code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    /* ── 구분선 ── */
    if (line.trim() === "---") {
      elements.push(<hr key={`hr-${i}`} className="border-white/10 my-8" />);
      i++;
      continue;
    }

    /* ── 제목 ── */
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-3xl font-extrabold text-white mt-14 mb-4 first:mt-0"
          dangerouslySetInnerHTML={{ __html: applyInline(line.slice(2)) }} />
      );
      i++; continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl font-bold text-white mt-12 mb-3 pb-2.5 border-b border-white/10"
          dangerouslySetInnerHTML={{ __html: applyInline(line.slice(3)) }} />
      );
      i++; continue;
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-semibold text-zinc-100 mt-10 mb-2"
          dangerouslySetInnerHTML={{ __html: applyInline(line.slice(4)) }} />
      );
      i++; continue;
    }

    /* ── 비순서 목록 ── */
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-4 pl-5 space-y-1.5">
          {items.map((item, j) => (
            <li key={j} className="text-zinc-300 leading-relaxed list-disc marker:text-primary-500"
              dangerouslySetInnerHTML={{ __html: applyInline(item) }} />
          ))}
        </ul>
      );
      continue;
    }

    /* ── 순서 목록 ── */
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-4 pl-5 space-y-1.5">
          {items.map((item, j) => (
            <li key={j} className="text-zinc-300 leading-relaxed list-decimal marker:text-primary-500"
              dangerouslySetInnerHTML={{ __html: applyInline(item) }} />
          ))}
        </ol>
      );
      continue;
    }

    /* ── 빈 줄 → 그냥 건너뜀 (단락은 아래 일반 단락 로직이 나눔) ── */
    if (line.trim() === "") {
      i++;
      continue;
    }

    /* ── 일반 단락: 연속된 줄을 하나의 <p>로 묶음 ── */
    const textLines: string[] = [];
    while (i < lines.length && !isSpecialLine(lines[i])) {
      textLines.push(lines[i]);
      i++;
    }
    elements.push(
      <p key={`p-${i}`} className="text-zinc-300 leading-[1.85] mb-5 text-[15px]"
        dangerouslySetInnerHTML={{ __html: textLines.map(applyInline).join("<br>") }} />
    );
  }

  return elements;
}
