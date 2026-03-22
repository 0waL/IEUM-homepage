import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/inquiries/[id]/comments - 관리자 댓글 작성
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { content } = await req.json();
  if (!content) {
    return NextResponse.json({ error: "내용을 입력해 주세요." }, { status: 400 });
  }

  // 사용자 ID 조회
  const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
  if (!user) return NextResponse.json({ error: "유저를 찾을 수 없습니다." }, { status: 404 });

  const comment = await prisma.inquiryComment.create({
    data: { content, inquiryId: params.id, authorId: user.id },
    include: { user: { select: { name: true, role: true } } },
  });

  // 댓글이 달리면 문의 상태를 answered로 변경
  await prisma.inquiry.update({
    where: { id: params.id },
    data: { status: "answered" },
  });

  return NextResponse.json(comment, { status: 201 });
}

// DELETE /api/inquiries/[id]/comments - 댓글 삭제 (commentId를 body로 받음)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { commentId } = await req.json();
  await prisma.inquiryComment.delete({ where: { id: commentId } });

  // 댓글이 남아있는지 확인 후 상태 복구
  const remaining = await prisma.inquiryComment.count({ where: { inquiryId: params.id } });
  if (remaining === 0) {
    await prisma.inquiry.update({ where: { id: params.id }, data: { status: "pending" } });
  }

  return NextResponse.json({ ok: true });
}
