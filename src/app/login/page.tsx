"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
    } else {
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      if (session?.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
          <ArrowLeft size={16} />
          홈으로
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-900/40">
              <span className="text-white font-bold">이음</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">로그인</h1>
            <p className="text-zinc-500 text-sm mt-1">IEUM 계정으로 로그인하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4">
            {error && (
              <div className="bg-red-950/50 border border-red-800/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">아이디</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin"
                className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-500 transition-all duration-200 disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              로그인
            </button>
          </form>

          <p className="text-center text-sm text-zinc-600 mt-4">
            초대 토큰이 있으신가요?{" "}
            <Link href="/signup" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
