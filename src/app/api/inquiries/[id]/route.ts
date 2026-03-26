export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/inquiries/[id] - 문의 상세
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: params.id },
    include: {
      comments: {
        include: { user: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(inquiry);
}

// DELETE /api/inquiries/[id] - 관리자만 삭제
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  await prisma.inquiry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
