import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MemberFormModal } from "@/components/admin/MemberFormModal";
import { DeleteMemberButton } from "@/components/admin/DeleteMemberButton";

export default async function AdminMembersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const members = await prisma.member.findMany({
    orderBy: [{ active: "desc" }, { order: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-100">멤버 관리</h1>
          <p className="text-zinc-400 text-sm mt-1">총 {members.length}명</p>
        </div>
        <MemberFormModal />
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {members.length === 0 ? (
          <div className="py-16 text-center text-zinc-500">
            <p>멤버가 없습니다.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800">
                <th className="text-left text-xs font-medium text-zinc-400 px-5 py-3">이름</th>
                <th className="text-left text-xs font-medium text-zinc-400 px-5 py-3">역할</th>
                <th className="text-left text-xs font-medium text-zinc-400 px-5 py-3 hidden md:table-cell">기수</th>
                <th className="text-left text-xs font-medium text-zinc-400 px-5 py-3">상태</th>
                <th className="text-right text-xs font-medium text-zinc-400 px-5 py-3">작업</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-zinc-800 hover:bg-zinc-800 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        {member.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-200 text-sm">{member.name}</p>
                        {member.bio && (
                          <p className="text-xs text-zinc-500 truncate max-w-xs">{member.bio}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-zinc-400">{member.role}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-sm text-zinc-400">{member.generation === 0 ? "0기 (창립)" : `${member.generation}기`}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        member.active
                          ? "bg-green-500/15 text-green-400"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {member.active ? "활동" : "졸업"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <MemberFormModal member={member} />
                      <DeleteMemberButton memberId={member.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
