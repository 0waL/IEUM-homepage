import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, role, bio, github, instagram, email, image, generation, order, active } = await req.json();

  if (!name || !role || !generation) {
    return NextResponse.json({ error: "필수 항목을 모두 입력해주세요." }, { status: 400 });
  }

  const member = await prisma.member.create({
    data: { name, role, bio, github, instagram, email, image, generation, order: order ?? 99, active: active ?? true },
  });

  return NextResponse.json(member, { status: 201 });
}
