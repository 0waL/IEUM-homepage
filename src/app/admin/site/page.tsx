"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Plus, Trash2, Edit2, Check, X } from "lucide-react";

const DEFAULT_MISSION =
  "이음은 경남과학고 학생들이 직접 기획하고 개발한 서비스를 운영하는 IT 동아리입니다. 실제로 사용되는 제품을 만들며 실전 경험을 쌓고, 서로의 성장을 돕습니다.\n\n대표 프로젝트인 gshs.app은 경남과학고 학생들이 급식, 시간표, 공지사항 등 학교 정보를 한 곳에서 확인할 수 있는 플랫폼으로, 현재도 많은 학생들이 매일 사용하고 있습니다.";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

const inputClass =
  "w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent";

export default function SitePage() {
  const [missionText, setMissionText] = useState("");
  const [savingMission, setSavingMission] = useState(false);
  const [missionSaved, setMissionSaved] = useState(false);

  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/site-content").then((r) => r.json()),
      fetch("/api/admin/faqs").then((r) => r.json()),
    ]).then(([content, faqList]) => {
      setMissionText(content.mission_text ?? DEFAULT_MISSION);
      setFaqs(faqList);
      setLoading(false);
    });
  }, []);

  const saveMission = async () => {
    setSavingMission(true);
    await fetch("/api/admin/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "mission_text", value: missionText }),
    });
    setSavingMission(false);
    setMissionSaved(true);
    setTimeout(() => setMissionSaved(false), 2000);
  };

  const addFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const res = await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: newQuestion, answer: newAnswer, order: faqs.length }),
    });
    const item = await res.json();
    setFaqs([...faqs, item]);
    setNewQuestion("");
    setNewAnswer("");
    setShowAdd(false);
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

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-extrabold text-zinc-100">사이트 설정</h1>

      {/* Mission text */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="font-semibold text-zinc-200 mb-1">동아리 소개 텍스트</h2>
        <p className="text-xs text-zinc-500 mb-4">
          홈페이지 '이음이란?' 섹션에 표시됩니다. 줄바꿈(엔터)으로 문단을 나눌 수 있습니다.
        </p>
        <textarea
          value={missionText}
          onChange={(e) => setMissionText(e.target.value)}
          rows={7}
          className={`${inputClass} resize-y`}
        />
        <button
          onClick={saveMission}
          disabled={savingMission}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-500 disabled:opacity-50 transition-colors"
        >
          {savingMission ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {missionSaved ? "저장됨 ✓" : "저장하기"}
        </button>
      </div>

      {/* FAQ */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-zinc-200 mb-0.5">자주 묻는 질문 (FAQ)</h2>
            <p className="text-xs text-zinc-500">홈페이지 FAQ 섹션에 표시됩니다.</p>
          </div>
          <button
            onClick={() => { setShowAdd(true); setEditingFaq(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors"
          >
            <Plus size={14} />
            추가
          </button>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mb-4 space-y-3">
            <input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="질문을 입력하세요"
              className={inputClass}
            />
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              rows={3}
              placeholder="답변을 입력하세요"
              className={`${inputClass} resize-none`}
            />
            <div className="flex gap-2">
              <button
                onClick={addFaq}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-500 transition-colors"
              >
                <Check size={14} /> 저장
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600 transition-colors"
              >
                <X size={14} /> 취소
              </button>
            </div>
          </div>
        )}

        {/* FAQ list */}
        <div className="space-y-2">
          {faqs.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-8">
              FAQ가 없습니다. '추가' 버튼으로 첫 항목을 만들어보세요.
            </p>
          )}
          {faqs.map((faq, idx) => (
            <div key={faq.id} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
              {editingFaq?.id === faq.id ? (
                <div className="space-y-3">
                  <input
                    value={editingFaq.question}
                    onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                    className={inputClass}
                  />
                  <textarea
                    value={editingFaq.answer}
                    onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateFaq(editingFaq)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-500 transition-colors"
                    >
                      <Check size={14} /> 저장
                    </button>
                    <button
                      onClick={() => setEditingFaq(null)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600 transition-colors"
                    >
                      <X size={14} /> 취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 text-xs text-zinc-500 font-mono mt-1">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-200 font-medium text-sm">{faq.question}</p>
                    <p className="text-zinc-400 text-xs mt-1 line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => { setEditingFaq(faq); setShowAdd(false); }}
                      className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteFaq(faq.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
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
