import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Allow login page without auth
  return (
    <div className="min-h-screen bg-gray-50">
      {session && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-6">
                <Link href="/admin" className="font-bold text-primary-600">
                  이음 관리자
                </Link>
                <AdminNav />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{session.user.name}</span>
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  사이트 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  );
}
