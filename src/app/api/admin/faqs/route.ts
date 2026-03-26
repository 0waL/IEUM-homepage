export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(faqs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question, answer, order } = await req.json();
  if (!question || !answer) {
    return NextResponse.json({ error: "질문과 답변을 입력해주세요." }, { status: 400 });
  }

  const faq = await prisma.fAQ.create({ data: { question, answer, order: order ?? 0 } });
  return NextResponse.json(faq, { status: 201 });
}
