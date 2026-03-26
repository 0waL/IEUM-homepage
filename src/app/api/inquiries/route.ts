export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/inquiries - 문의 목록
export async function GET() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      comments: { select: { id: true } },
    },
  });
  return NextResponse.json(inquiries);
}

// POST /api/inquiries - 문의 작성 (누구나)
export async function POST(req: Request) {
  const { title, content } = await req.json();
  if (!title || !content) {
    return NextResponse.json({ error: "필수 항목을 입력해 주세요." }, { status: 400 });
  }
  const inquiry = await prisma.inquiry.create({
    data: { title, content, author: "익명" },
  });
  return NextResponse.json(inquiry, { status: 201 });
}
