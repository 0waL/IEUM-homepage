import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, role, bio, github, email, year, order, active } = await req.json();

  const member = await prisma.member.update({
    where: { id: params.id },
    data: { name, role, bio, github, email, year, order, active },
  });

  return NextResponse.json(member);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.member.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
