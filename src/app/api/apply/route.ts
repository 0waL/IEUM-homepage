export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { name, grade, field, motivation, email } = await req.json();

  if (!name?.trim() || !grade?.trim() || !field?.trim() || !motivation?.trim()) {
    return NextResponse.json({ error: "필수 항목을 모두 입력해주세요." }, { status: 400 });
  }

  // 지원 기간 체크
  const [startSetting, deadlineSetting] = await Promise.all([
    prisma.siteContent.findUnique({ where: { key: "apply_start" } }),
    prisma.siteContent.findUnique({ where: { key: "apply_deadline" } }),
  ]);
  const now = new Date();
  if (startSetting?.value && new Date(startSetting.value) > now) {
    return NextResponse.json({ error: "아직 지원 기간이 시작되지 않았습니다." }, { status: 403 });
  }
  if (deadlineSetting?.value && new Date(deadlineSetting.value) < now) {
    return NextResponse.json({ error: "지원 기간이 마감되었습니다." }, { status: 403 });
  }

  const application = await prisma.application.create({
    data: { name: name.trim(), grade: grade.trim(), field: field.trim(), motivation: motivation.trim(), email: email?.trim() || null },
  });

  return NextResponse.json(application, { status: 201 });
}
