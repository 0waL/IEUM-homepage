import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { name, email, password, token } = await req.json();

  if (!name || !email || !password || !token) {
    return NextResponse.json({ error: "모든 필드를 입력해주세요." }, { status: 400 });
  }

  // 토큰 확인
  const inviteToken = await prisma.inviteToken.findUnique({ where: { token } });
  if (!inviteToken) {
    return NextResponse.json({ error: "유효하지 않은 초대 토큰입니다." }, { status: 400 });
  }
  if (inviteToken.used) {
    return NextResponse.json({ error: "이미 사용된 초대 토큰입니다." }, { status: 400 });
  }
  if (inviteToken.expiresAt && inviteToken.expiresAt < new Date()) {
    return NextResponse.json({ error: "만료된 초대 토큰입니다." }, { status: 400 });
  }

  // 이메일 중복 확인
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "이미 사용 중인 이메일입니다." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: "member" },
  });

  // 토큰 사용 처리
  await prisma.inviteToken.update({
    where: { token },
    data: { used: true, usedBy: user.id },
  });

  return NextResponse.json({ ok: true });
}
