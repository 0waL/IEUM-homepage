import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import { LogoutButton } from "@/components/LogoutButton";
import { AdminThemeToggle } from "@/components/AdminThemeToggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-zinc-950">
      {session && (
        <div className="bg-zinc-900 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-6">
                <Link href="/admin" className="font-bold text-primary-500">
                  이음 관리자
                </Link>
                <AdminNav />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-400">{session.user.name}</span>
                <Link
                  href="/"
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  사이트 보기
                </Link>
                <AdminThemeToggle />
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  );
}
