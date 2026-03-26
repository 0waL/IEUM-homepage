export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.siteContent.findMany();
  const content: Record<string, string> = {};
  items.forEach((item) => { content[item.key] = item.value; });
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { key, value } = await req.json();
  if (!key) return NextResponse.json({ error: "key가 필요합니다." }, { status: 400 });

  const item = await prisma.siteContent.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return NextResponse.json(item);
}
