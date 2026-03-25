"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Trash2, Users, CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react";

interface Application {
  id: string;
  name: string;
  grade: string;
  field: string;
  motivation: string;
  email: string | null;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

interface Stats { total: number; pending: number; accepted: number; rejected: number; }

const inputClass =
  "w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent";

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

const STATUS_MAP = {
  pending: { label: "검토중", color: "bg-yellow-500/15 text-yellow-400", icon: Clock },
  accepted: { label: "합격", color: "bg-green-500/15 text-green-400", icon: CheckCircle },
  rejected: { label: "불합격", color: "bg-red-500/15 text-red-400", icon: XCircle },
};

export default function AdminApplyPage() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [selected, setSelected] = useState<Application | null>(null);

  // 설정
  const [applyStart, setApplyStart] = useState("");
  const [applyDeadline, setApplyDeadline] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [savingStart, setSavingStart] = useState(false); const [savedStart, setSavedStart] = useState(false);
  const [savingDeadline, setSavingDeadline] = useState(false); const [savedDeadline, setSavedDeadline] = useState(false);
  const [savingUrl, setSavingUrl] = useState(false); const [savedUrl, setSavedUrl] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/apply").then((r) => {
        if (!r.ok) throw new Error(`지원자 데이터 로드 실패 (${r.status})`);
        return r.json();
      }),
      fetch("/api/admin/site-content").then((r) => r.json()),
    ]).then(([applyData, content]) => {
      setApplications(applyData.applications ?? []);
      setStats(applyData.stats ?? { total: 0, pending: 0, accepted: 0, rejected: 0 });
      setApplyStart(content["apply_start"] ?? "");
      setApplyDeadline(content["apply_deadline"] ?? "");
      setFormUrl(content["apply_form_url"] ?? "");
      setLoading(false);
    }).catch((err: Error) => {
      setFetchError(err.message);
      setLoading(false);
    });
  }, []);

  const saveKey = async (
    key: string, value: string,
    setSaving: (v: boolean) => void, setSaved: (v: boolean) => void,
  ) => {
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

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/apply/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setApplications((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: status as Application["status"] } : a)
    );
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status: status as Application["status"] } : null);
    setStats((prev) => {
      const oldStatus = applications.find((a) => a.id === id)?.status ?? "pending";
      return { ...prev, [oldStatus]: prev[oldStatus] - 1, [status]: prev[status as keyof Stats] + 1 };
    });
  };

  const deleteApplication = async (id: string) => {
    if (!confirm("지원서를 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/apply/${id}`, { method: "DELETE" });
    setApplications((prev) => prev.filter((a) => a.id !== id));
    if (selected?.id === id) setSelected(null);
    const app = applications.find((a) => a.id === id);
    if (app) setStats((prev) => ({ ...prev, total: prev.total - 1, [app.status]: prev[app.status as keyof Stats] - 1 }));
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-zinc-500" size={24} />
    </div>
  );

  if (fetchError) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-red-400 text-sm">{fetchError}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold text-zinc-100">지원하기 관리</h1>

      {/* 신청 기간 설정 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <div>
          <h2 className="font-semibold text-zinc-200 mb-0.5">신청 기간 설정</h2>
          <p className="text-xs text-zinc-500">시작/종료 일시를 설정합니다. 기간 외에는 지원하기 페이지 접근이 차단됩니다.</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">신청 시작일</label>
          <input type="datetime-local" value={applyStart} onChange={(e) => setApplyStart(e.target.value)} className={inputClass} />
          <p className="text-xs text-zinc-600 mt-1">비워두면 즉시 시작.</p>
          <SaveButton onClick={() => saveKey("apply_start", applyStart, setSavingStart, setSavedStart)} saving={savingStart} saved={savedStart} />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">신청 종료일</label>
          <input type="datetime-local" value={applyDeadline} onChange={(e) => setApplyDeadline(e.target.value)} className={inputClass} />
          <p className="text-xs text-zinc-600 mt-1">비워두면 기한 없이 열림.</p>
          <SaveButton onClick={() => saveKey("apply_deadline", applyDeadline, setSavingDeadline, setSavedDeadline)} saving={savingDeadline} saved={savedDeadline} />
        </div>
      </div>

      {/* 구글 폼 링크 설정 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="font-semibold text-zinc-200 mb-1">구글 폼 링크</h2>
        <p className="text-xs text-zinc-500 mb-4">지원하기 페이지에 구글 폼 링크 버튼을 표시합니다. 비워두면 버튼이 숨겨집니다.</p>
        <input
          value={formUrl}
          onChange={(e) => setFormUrl(e.target.value)}
          placeholder="https://forms.gle/..."
          className={inputClass}
        />
        {formUrl && (
          <a href={formUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary-400 hover:underline mt-2">
            <ExternalLink size={11} /> 링크 확인
          </a>
        )}
        <SaveButton onClick={() => saveKey("apply_form_url", formUrl, setSavingUrl, setSavedUrl)} saving={savingUrl} saved={savedUrl} />
      </div>

      {/* 지원자 현황 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="font-semibold text-zinc-200 mb-4">지원자 현황</h2>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "전체", value: stats.total, color: "text-zinc-100" },
            { label: "검토중", value: stats.pending, color: "text-yellow-400" },
            { label: "합격", value: stats.accepted, color: "text-green-400" },
            { label: "불합격", value: stats.rejected, color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="bg-zinc-800 rounded-xl p-4 text-center">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <Users size={32} className="text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">아직 지원자가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {applications.map((app) => {
              const s = STATUS_MAP[app.status];
              return (
                <div
                  key={app.id}
                  onClick={() => setSelected(selected?.id === app.id ? null : app)}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 cursor-pointer hover:border-zinc-600 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-zinc-200 text-sm">{app.name}</span>
                        <span className="text-zinc-500 text-xs">{app.grade}</span>
                        <span className="text-zinc-500 text-xs">·</span>
                        <span className="text-zinc-400 text-xs">{app.field}</span>
                      </div>
                      <p className="text-zinc-500 text-xs">{new Date(app.createdAt).toLocaleString("ko-KR")}</p>
                    </div>
                    <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium ${s.color}`}>{s.label}</span>
                  </div>

                  {selected?.id === app.id && (
                    <div className="mt-4 pt-4 border-t border-zinc-700 space-y-3" onClick={(e) => e.stopPropagation()}>
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">지원 동기</p>
                        <p className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed">{app.motivation}</p>
                      </div>
                      {app.email && (
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">이메일</p>
                          <p className="text-zinc-300 text-sm">{app.email}</p>
                        </div>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => updateStatus(app.id, "accepted")}
                          disabled={app.status === "accepted"}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600/20 text-green-400 border border-green-700/40 rounded-lg text-xs font-medium hover:bg-green-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <CheckCircle size={13} /> 합격
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, "rejected")}
                          disabled={app.status === "rejected"}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 text-red-400 border border-red-700/40 rounded-lg text-xs font-medium hover:bg-red-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <XCircle size={13} /> 불합격
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, "pending")}
                          disabled={app.status === "pending"}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-600/20 text-yellow-400 border border-yellow-700/40 rounded-lg text-xs font-medium hover:bg-yellow-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <Clock size={13} /> 검토중
                        </button>
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 text-zinc-400 rounded-lg text-xs font-medium hover:bg-zinc-600 hover:text-red-400 transition-colors ml-auto"
                        >
                          <Trash2 size={13} /> 삭제
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
