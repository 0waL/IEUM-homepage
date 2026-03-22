"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Plus, Trash2, Edit2, Check, X } from "lucide-react";

/* ─── default values (동기화: about/page.tsx) ─── */
const DEFAULT_MISSION =
  "이음은 경남과학고 학생들이 직접 기획하고 개발한 서비스를 운영하는 IT 동아리입니다. 실제로 사용되는 제품을 만들며 실전 경험을 쌓고, 서로의 성장을 돕습니다.\n\n대표 프로젝트인 gshs.app은 경남과학고 학생들이 급식, 시간표, 공지사항 등 학교 정보를 한 곳에서 확인할 수 있는 플랫폼으로, 현재도 많은 학생들이 매일 사용하고 있습니다.";

const DEFAULT_HERO_SUBTITLE =
  "연결하다, 잇다, 이음.\n학교와 기술을 이어 더 나은 학교 생활을 만듭니다.";
const DEFAULT_MISSION_TITLE = "우리의 미션";
const DEFAULT_MISSION_BODY =
  "이음은 경남과학고 학생들이 직접 기획하고 개발한 서비스를 운영하는 IT 동아리입니다.\n우리는 실제로 사용되는 제품을 만들며 실전 경험을 쌓고, 서로의 성장을 돕습니다.\n\n대표 프로젝트인 gshs.app은 경남과학고 학생들이 급식, 시간표, 공지사항 등 학교 정보를 한 곳에서 확인할 수 있는 플랫폼으로, 현재도 많은 학생들이 매일 사용하고 있습니다.";
const DEFAULT_QUOTE = "연결하다, 잇다, 이음";
const DEFAULT_QUOTE_SUB = "기술로 사람과 사람을, 학교와 학생을 연결합니다";
const DEFAULT_VALUES = [
  { title: "실전 경험", desc: "교과서 밖에서, 실제로 사용되는 서비스를 직접 만들며 배웁니다." },
  { title: "팀워크", desc: "혼자가 아닌 팀으로, 서로의 강점을 모아 더 큰 것을 만듭니다." },
  { title: "성장", desc: "스터디, 해커톤, 공모전을 통해 지속적으로 실력을 키워갑니다." },
  { title: "기여", desc: "우리가 만드는 서비스로 학교 구성원의 삶을 더 편리하게 만듭니다." },
  { title: "지식 공유", desc: "배운 것을 나누고, 함께 공부하며 집단 지성을 키웁니다." },
  { title: "도전", desc: "새로운 기술과 아이디어에 두려워하지 않고 도전합니다." },
];
const DEFAULT_TECHSTACK = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Node.js", category: "Backend" },
  { name: "Prisma", category: "ORM" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Figma", category: "Design" },
];
const DEFAULT_HISTORY = [
  { year: "2025", events: ["이음 동아리 공식 홈페이지 오픈", "gshs.app v2.0 출시"] },
  { year: "2024", events: ["gshs.app 리뉴얼 작업 시작", "교내 해커톤 참가", "신입부원 모집"] },
  { year: "2023", events: ["이음(IEUM) 동아리 창설", "gshs.app v1.0 개발 및 출시"] },
];
const DEFAULT_ACTIVITIES = [
  { title: "서비스 개발", desc: "gshs.app을 포함한 학교 학생들을 위한 웹 서비스를 직접 기획하고 개발합니다." },
  { title: "스터디 & 세미나", desc: "서로의 지식을 나누는 스터디와 세미나를 정기적으로 진행합니다." },
  { title: "해커톤 & 공모전", desc: "다양한 해커톤과 공모전에 참여해 실력을 키우고 팀워크를 다집니다." },
];

/* ─── types ─── */
interface FAQItem { id: string; question: string; answer: string; order: number; }
interface ValueItem { title: string; desc: string; }
interface TechItem { name: string; category: string; }
interface HistoryItem { year: string; events: string[]; }
interface ActivityItem { title: string; desc: string; }

/* ─── helpers ─── */
function parseJson<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback;
  try { return JSON.parse(val) as T; } catch { return fallback; }
}

const inputClass =
  "w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent";

/* ─── 저장 버튼 ─── */
function SaveButton({ onClick, saving, saved }: { onClick: () => void; saving: boolean; saved: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-500 disabled:opacity-50 transition-colors"
    >
      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
      {saved ? "저장됨 ✓" : "저장하기"}
    </button>
  );
}

/* ─── 단순 텍스트 저장 hook ─── */
function useSaveKey(key: string, initial: string) {
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return { value, setValue, saving, saved, save };
}

/* ════════════════════════════════════════════
   Main Page
   ════════════════════════════════════════════ */
export default function SitePage() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/site-content").then((r) => r.json()),
      fetch("/api/admin/faqs").then((r) => r.json()),
    ]).then(([c, faqList]) => {
      setContent(c);
      setFaqs(faqList);
      setLoading(false);
    });
  }, []);

  /* ── 홈 미션 텍스트 ── */
  const [missionText, setMissionText] = useState("");
  const [savingMission, setSavingMission] = useState(false);
  const [missionSaved, setMissionSaved] = useState(false);

  /* ── FAQ ── */
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  /* ── 소개 페이지 단순 텍스트 ── */
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [missionTitle, setMissionTitle] = useState("");
  const [missionBody, setMissionBody] = useState("");
  const [quote, setQuote] = useState("");
  const [quoteSub, setQuoteSub] = useState("");
  const [aboutSaving, setAboutSaving] = useState<Record<string, boolean>>({});
  const [aboutSaved, setAboutSaved] = useState<Record<string, boolean>>({});

  /* ── 핵심 가치 ── */
  const [values, setValues] = useState<ValueItem[]>([]);
  const [editingValue, setEditingValue] = useState<{ idx: number; item: ValueItem } | null>(null);
  const [showAddValue, setShowAddValue] = useState(false);
  const [newValue, setNewValue] = useState<ValueItem>({ title: "", desc: "" });
  const [savingValues, setSavingValues] = useState(false);
  const [savedValues, setSavedValues] = useState(false);

  /* ── 기술 스택 ── */
  const [techstack, setTechstack] = useState<TechItem[]>([]);
  const [editingTech, setEditingTech] = useState<{ idx: number; item: TechItem } | null>(null);
  const [showAddTech, setShowAddTech] = useState(false);
  const [newTech, setNewTech] = useState<TechItem>({ name: "", category: "" });
  const [savingTech, setSavingTech] = useState(false);
  const [savedTech, setSavedTech] = useState(false);

  /* ── 우리가 하는 일 ── */
  const [activities, setActivities] = useState<ActivityItem[]>(DEFAULT_ACTIVITIES);
  const [editingActivity, setEditingActivity] = useState<{ idx: number; item: ActivityItem } | null>(null);
  const [savingActivities, setSavingActivities] = useState(false);
  const [savedActivities, setSavedActivities] = useState(false);

  /* ── 연혁 ── */
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [editingHistory, setEditingHistory] = useState<{ idx: number; item: HistoryItem } | null>(null);
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [newHistory, setNewHistory] = useState<HistoryItem>({ year: "", events: [""] });
  const [savingHistory, setSavingHistory] = useState(false);
  const [savedHistory, setSavedHistory] = useState(false);

  /* ── content 로드 후 상태 초기화 ── */
  useEffect(() => {
    if (loading) return;
    setMissionText(content["mission_text"] ?? DEFAULT_MISSION);
    setHeroSubtitle(content["about_hero_subtitle"] ?? DEFAULT_HERO_SUBTITLE);
    setMissionTitle(content["about_mission_title"] ?? DEFAULT_MISSION_TITLE);
    setMissionBody(content["about_mission_body"] ?? DEFAULT_MISSION_BODY);
    setQuote(content["about_quote"] ?? DEFAULT_QUOTE);
    setQuoteSub(content["about_quote_sub"] ?? DEFAULT_QUOTE_SUB);
    setValues(parseJson(content["about_values"], DEFAULT_VALUES));
    setTechstack(parseJson(content["about_techstack"], DEFAULT_TECHSTACK));
    setHistory(parseJson(content["about_history"], DEFAULT_HISTORY));
    setActivities(parseJson(content["home_activities"], DEFAULT_ACTIVITIES));
  }, [loading, content]);

  /* ─── 저장 헬퍼 ─── */
  const saveKey = async (key: string, value: string) => {
    await fetch("/api/admin/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
  };

  const saveAboutField = async (key: string, value: string) => {
    setAboutSaving((p) => ({ ...p, [key]: true }));
    await saveKey(key, value);
    setAboutSaving((p) => ({ ...p, [key]: false }));
    setAboutSaved((p) => ({ ...p, [key]: true }));
    setTimeout(() => setAboutSaved((p) => ({ ...p, [key]: false })), 2000);
  };

  const saveJsonKey = async (
    key: string, value: unknown,
    setSaving: (v: boolean) => void, setSaved: (v: boolean) => void,
  ) => {
    setSaving(true);
    await saveKey(key, JSON.stringify(value));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  /** 연혁 저장: 같은 연도 항목을 병합한 뒤 저장 */
  const saveHistory = async (raw: HistoryItem[]) => {
    const map = new Map<string, string[]>();
    for (const item of raw) map.set(item.year, [...(map.get(item.year) ?? []), ...item.events]);
    const merged = Array.from(map.entries())
      .map(([year, events]) => ({ year, events }))
      .sort((a, b) => Number(b.year) - Number(a.year));
    setHistory(merged);
    await saveJsonKey("about_history", merged, setSavingHistory, setSavedHistory);
  };

  /* ─── 홈 미션 저장 ─── */
  const saveMission = async () => {
    setSavingMission(true);
    await saveKey("mission_text", missionText);
    setSavingMission(false);
    setMissionSaved(true);
    setTimeout(() => setMissionSaved(false), 2000);
  };

  /* ─── FAQ ─── */
  const addFaq = async () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    const res = await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: newFaqQ, answer: newFaqA, order: faqs.length }),
    });
    setFaqs([...faqs, await res.json()]);
    setNewFaqQ(""); setNewFaqA(""); setShowAddFaq(false);
  };
  const updateFaq = async (faq: FAQItem) => {
    await fetch(`/api/admin/faqs/${faq.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: faq.question, answer: faq.answer, order: faq.order }),
    });
    setFaqs(faqs.map((f) => (f.id === faq.id ? faq : f)));
    setEditingFaq(null);
  };
  const deleteFaq = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-zinc-500" size={24} />
      </div>
    );

  /* ════════════════════════════════════════════ */
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold text-zinc-100">사이트 설정</h1>

      {/* ── 홈 미션 텍스트 ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="font-semibold text-zinc-200 mb-1">홈페이지 — 동아리 소개 텍스트</h2>
        <p className="text-xs text-zinc-500 mb-4">
          홈 '이음이란?' 섹션 본문. 빈 줄로 문단 구분.
        </p>
        <textarea
          value={missionText}
          onChange={(e) => setMissionText(e.target.value)}
          rows={5}
          className={`${inputClass} resize-y`}
        />
        <SaveButton onClick={saveMission} saving={savingMission} saved={missionSaved} />
      </div>

      {/* ── 우리가 하는 일 ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="mb-4">
          <h2 className="font-semibold text-zinc-200 mb-0.5">홈페이지 — 우리가 하는 일</h2>
          <p className="text-xs text-zinc-500">3개 활동 카드의 제목과 설명을 수정합니다.</p>
        </div>
        <div className="space-y-3">
          {activities.map((item, idx) => (
            <div key={idx} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
              {editingActivity?.idx === idx ? (
                <div className="space-y-3">
                  <input
                    value={editingActivity.item.title}
                    onChange={(e) => setEditingActivity({ idx, item: { ...editingActivity.item, title: e.target.value } })}
                    className={inputClass}
                    placeholder="제목"
                  />
                  <textarea
                    value={editingActivity.item.desc}
                    onChange={(e) => setEditingActivity({ idx, item: { ...editingActivity.item, desc: e.target.value } })}
                    rows={2}
                    className={`${inputClass} resize-none`}
                    placeholder="설명"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const v = activities.map((x, i) => i === idx ? editingActivity.item : x);
                        setActivities(v);
                        saveJsonKey("home_activities", v, setSavingActivities, setSavedActivities);
                        setEditingActivity(null);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-500 transition-colors"
                    >
                      <Check size={14} /> 저장
                    </button>
                    <button
                      onClick={() => setEditingActivity(null)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600 transition-colors"
                    >
                      <X size={14} /> 취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 text-xs text-zinc-500 font-mono mt-1">{String(idx + 1).padStart(2, "0")}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-200 font-medium text-sm">{item.title}</p>
                    <p className="text-zinc-400 text-xs mt-1">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setEditingActivity({ idx, item: { ...item } })}
                    className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {savingActivities && <p className="text-xs text-zinc-400 mt-2">저장 중...</p>}
        {savedActivities && <p className="text-xs text-green-400 mt-2">저장됨 ✓</p>}
      </div>

      {/* ════════════════════════════════════════════
          동아리 소개 페이지
          ════════════════════════════════════════════ */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
        <h2 className="font-semibold text-zinc-200">동아리 소개 페이지 (/about)</h2>

        {/* 히어로 부제목 */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">히어로 부제목</label>
          <textarea
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            rows={2}
            className={`${inputClass} resize-none`}
          />
          <SaveButton
            onClick={() => saveAboutField("about_hero_subtitle", heroSubtitle)}
            saving={!!aboutSaving["about_hero_subtitle"]}
            saved={!!aboutSaved["about_hero_subtitle"]}
          />
        </div>

        {/* 미션 제목 */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">미션 섹션 제목</label>
          <input
            value={missionTitle}
            onChange={(e) => setMissionTitle(e.target.value)}
            className={inputClass}
          />
          <SaveButton
            onClick={() => saveAboutField("about_mission_title", missionTitle)}
            saving={!!aboutSaving["about_mission_title"]}
            saved={!!aboutSaved["about_mission_title"]}
          />
        </div>

        {/* 미션 본문 */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">미션 본문</label>
          <p className="text-xs text-zinc-500 mb-2">빈 줄로 문단 구분.</p>
          <textarea
            value={missionBody}
            onChange={(e) => setMissionBody(e.target.value)}
            rows={5}
            className={`${inputClass} resize-y`}
          />
          <SaveButton
            onClick={() => saveAboutField("about_mission_body", missionBody)}
            saving={!!aboutSaving["about_mission_body"]}
            saved={!!aboutSaved["about_mission_body"]}
          />
        </div>

        {/* 인용구 */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">인용구</label>
          <input
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className={inputClass}
          />
          <SaveButton
            onClick={() => saveAboutField("about_quote", quote)}
            saving={!!aboutSaving["about_quote"]}
            saved={!!aboutSaved["about_quote"]}
          />
        </div>

        {/* 인용구 부제목 */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">인용구 부제목</label>
          <input
            value={quoteSub}
            onChange={(e) => setQuoteSub(e.target.value)}
            className={inputClass}
          />
          <SaveButton
            onClick={() => saveAboutField("about_quote_sub", quoteSub)}
            saving={!!aboutSaving["about_quote_sub"]}
            saved={!!aboutSaved["about_quote_sub"]}
          />
        </div>
      </div>

      {/* ── 핵심 가치 ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-zinc-200 mb-0.5">핵심 가치</h2>
            <p className="text-xs text-zinc-500">아이콘은 순서에 따라 자동 배정됩니다.</p>
          </div>
          <button
            onClick={() => { setShowAddValue(true); setEditingValue(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors"
          >
            <Plus size={14} /> 추가
          </button>
        </div>

        {showAddValue && (
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mb-4 space-y-3">
            <input value={newValue.title} onChange={(e) => setNewValue({ ...newValue, title: e.target.value })} placeholder="제목" className={inputClass} />
            <textarea value={newValue.desc} onChange={(e) => setNewValue({ ...newValue, desc: e.target.value })} rows={2} placeholder="설명" className={`${inputClass} resize-none`} />
            <div className="flex gap-2">
              <button onClick={() => { const v = [...values, newValue]; setValues(v); saveJsonKey("about_values", v, setSavingValues, setSavedValues); setNewValue({ title: "", desc: "" }); setShowAddValue(false); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-500 transition-colors"><Check size={14} /> 저장</button>
              <button onClick={() => setShowAddValue(false)} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600 transition-colors"><X size={14} /> 취소</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {values.map((item, idx) => (
            <div key={idx} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
              {editingValue?.idx === idx ? (
                <div className="space-y-3">
                  <input value={editingValue.item.title} onChange={(e) => setEditingValue({ idx, item: { ...editingValue.item, title: e.target.value } })} className={inputClass} />
                  <textarea value={editingValue.item.desc} onChange={(e) => setEditingValue({ idx, item: { ...editingValue.item, desc: e.target.value } })} rows={2} className={`${inputClass} resize-none`} />
                  <div className="flex gap-2">
                    <button onClick={() => { const v = values.map((x, i) => i === idx ? editingValue.item : x); setValues(v); saveJsonKey("about_values", v, setSavingValues, setSavedValues); setEditingValue(null); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-500 transition-colors"><Check size={14} /> 저장</button>
                    <button onClick={() => setEditingValue(null)} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600 transition-colors"><X size={14} /> 취소</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 text-xs text-zinc-500 font-mono mt-1">{String(idx + 1).padStart(2, "0")}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-200 font-medium text-sm">{item.title}</p>
                    <p className="text-zinc-400 text-xs mt-1">{item.desc}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => { setEditingValue({ idx, item: { ...item } }); setShowAddValue(false); }} className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 rounded-lg transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => { const v = values.filter((_, i) => i !== idx); setValues(v); saveJsonKey("about_values", v, setSavingValues, setSavedValues); }} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {savedValues && <p className="text-xs text-green-400 mt-2">저장됨 ✓</p>}
      </div>

      {/* ── 기술 스택 ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-zinc-200">기술 스택</h2>
          <button
            onClick={() => { setShowAddTech(true); setEditingTech(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors"
          >
            <Plus size={14} /> 추가
          </button>
        </div>

        {showAddTech && (
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mb-4 space-y-3">
            <input value={newTech.name} onChange={(e) => setNewTech({ ...newTech, name: e.target.value })} placeholder="기술 이름 (예: React)" className={inputClass} />
            <input value={newTech.category} onChange={(e) => setNewTech({ ...newTech, category: e.target.value })} placeholder="카테고리 (예: Frontend)" className={inputClass} />
            <div className="flex gap-2">
              <button onClick={() => { const v = [...techstack, newTech]; setTechstack(v); saveJsonKey("about_techstack", v, setSavingTech, setSavedTech); setNewTech({ name: "", category: "" }); setShowAddTech(false); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-500 transition-colors"><Check size={14} /> 저장</button>
              <button onClick={() => setShowAddTech(false)} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600 transition-colors"><X size={14} /> 취소</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {techstack.map((item, idx) => (
            <div key={idx} className="bg-zinc-800 border border-zinc-700 rounded-xl p-3">
              {editingTech?.idx === idx ? (
                <div className="flex gap-2">
                  <input value={editingTech.item.name} onChange={(e) => setEditingTech({ idx, item: { ...editingTech.item, name: e.target.value } })} className={`${inputClass} flex-1`} />
                  <input value={editingTech.item.category} onChange={(e) => setEditingTech({ idx, item: { ...editingTech.item, category: e.target.value } })} className={`${inputClass} flex-1`} />
                  <button onClick={() => { const v = techstack.map((x, i) => i === idx ? editingTech.item : x); setTechstack(v); saveJsonKey("about_techstack", v, setSavingTech, setSavedTech); setEditingTech(null); }} className="p-1.5 text-green-400 hover:bg-zinc-700 rounded-lg transition-colors"><Check size={14} /></button>
                  <button onClick={() => setEditingTech(null)} className="p-1.5 text-zinc-500 hover:bg-zinc-700 rounded-lg transition-colors"><X size={14} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <span className="text-zinc-200 text-sm font-medium">{item.name}</span>
                    <span className="text-zinc-500 text-xs ml-2">{item.category}</span>
                  </div>
                  <button onClick={() => { setEditingTech({ idx, item: { ...item } }); setShowAddTech(false); }} className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 rounded-lg transition-colors"><Edit2 size={13} /></button>
                  <button onClick={() => { const v = techstack.filter((_, i) => i !== idx); setTechstack(v); saveJsonKey("about_techstack", v, setSavingTech, setSavedTech); }} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={13} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
        {savedTech && <p className="text-xs text-green-400 mt-2">저장됨 ✓</p>}
      </div>

      {/* ── 연혁 ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-zinc-200">연혁</h2>
          <button
            onClick={() => { setShowAddHistory(true); setEditingHistory(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors"
          >
            <Plus size={14} /> 연도 추가
          </button>
        </div>

        {showAddHistory && (
          <HistoryEditor
            item={newHistory}
            onChange={setNewHistory}
            inputClass={inputClass}
            onSave={() => {
              saveHistory([newHistory, ...history]);
              setNewHistory({ year: "", events: [""] });
              setShowAddHistory(false);
            }}
            onCancel={() => setShowAddHistory(false)}
          />
        )}

        <div className="space-y-2">
          {history.map((item, idx) => (
            <div key={idx} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
              {editingHistory?.idx === idx ? (
                <HistoryEditor
                  item={editingHistory.item}
                  onChange={(updated) => setEditingHistory({ idx, item: updated })}
                  inputClass={inputClass}
                  onSave={() => {
                    saveHistory(history.map((x, i) => i === idx ? editingHistory.item : x));
                    setEditingHistory(null);
                  }}
                  onCancel={() => setEditingHistory(null)}
                />
              ) : (
                <div className="flex items-start gap-3">
                  <span className="text-primary-400 font-bold text-sm flex-shrink-0 mt-0.5">{item.year}</span>
                  <div className="flex-1 min-w-0">
                    {item.events.map((ev, ei) => (
                      <p key={ei} className="text-zinc-400 text-xs">{ev}</p>
                    ))}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => { setEditingHistory({ idx, item: { ...item, events: [...item.events] } }); setShowAddHistory(false); }} className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 rounded-lg transition-colors"><Edit2 size={13} /></button>
                    <button onClick={() => { saveHistory(history.filter((_, i) => i !== idx)); }} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {savedHistory && <p className="text-xs text-green-400 mt-2">저장됨 ✓</p>}
      </div>

      {/* ── FAQ ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-zinc-200 mb-0.5">자주 묻는 질문 (FAQ)</h2>
            <p className="text-xs text-zinc-500">홈페이지 FAQ 섹션에 표시됩니다.</p>
          </div>
          <button
            onClick={() => { setShowAddFaq(true); setEditingFaq(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors"
          >
            <Plus size={14} /> 추가
          </button>
        </div>

        {showAddFaq && (
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mb-4 space-y-3">
            <input value={newFaqQ} onChange={(e) => setNewFaqQ(e.target.value)} placeholder="질문을 입력하세요" className={inputClass} />
            <textarea value={newFaqA} onChange={(e) => setNewFaqA(e.target.value)} rows={3} placeholder="답변을 입력하세요" className={`${inputClass} resize-none`} />
            <div className="flex gap-2">
              <button onClick={addFaq} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-500 transition-colors"><Check size={14} /> 저장</button>
              <button onClick={() => setShowAddFaq(false)} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600 transition-colors"><X size={14} /> 취소</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {faqs.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-8">FAQ가 없습니다.</p>
          )}
          {faqs.map((faq, idx) => (
            <div key={faq.id} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
              {editingFaq?.id === faq.id ? (
                <div className="space-y-3">
                  <input value={editingFaq.question} onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })} className={inputClass} />
                  <textarea value={editingFaq.answer} onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
                  <div className="flex gap-2">
                    <button onClick={() => updateFaq(editingFaq)} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-500 transition-colors"><Check size={14} /> 저장</button>
                    <button onClick={() => setEditingFaq(null)} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600 transition-colors"><X size={14} /> 취소</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 text-xs text-zinc-500 font-mono mt-1">{String(idx + 1).padStart(2, "0")}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-200 font-medium text-sm">{faq.question}</p>
                    <p className="text-zinc-400 text-xs mt-1 line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => { setEditingFaq(faq); setShowAddFaq(false); }} className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 rounded-lg transition-colors"><Edit2 size={14} /></button>
                    <button onClick={() => deleteFaq(faq.id)} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   연혁 편집 서브컴포넌트
   ════════════════════════════════════════════ */
function HistoryEditor({
  item, onChange, inputClass, onSave, onCancel,
}: {
  item: { year: string; events: string[] };
  onChange: (v: { year: string; events: string[] }) => void;
  inputClass: string;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mb-4 space-y-3">
      <input
        value={item.year}
        onChange={(e) => onChange({ ...item, year: e.target.value })}
        placeholder="연도 (예: 2026)"
        className={inputClass}
      />
      <div className="space-y-2">
        {item.events.map((ev, ei) => (
          <div key={ei} className="flex gap-2">
            <input
              value={ev}
              onChange={(e) => {
                const events = item.events.map((x, i) => i === ei ? e.target.value : x);
                onChange({ ...item, events });
              }}
              placeholder="이벤트 내용"
              className={`${inputClass} flex-1`}
            />
            <button
              onClick={() => onChange({ ...item, events: item.events.filter((_, i) => i !== ei) })}
              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange({ ...item, events: [...item.events, ""] })}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <Plus size={12} /> 항목 추가
        </button>
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-500 transition-colors"><Check size={14} /> 저장</button>
        <button onClick={onCancel} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600 transition-colors"><X size={14} /> 취소</button>
      </div>
    </div>
  );
}
