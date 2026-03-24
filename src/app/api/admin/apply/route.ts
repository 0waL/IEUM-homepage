import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [applications, total, pending, accepted, rejected] = await Promise.all([
    prisma.application.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: "pending" } }),
    prisma.application.count({ where: { status: "accepted" } }),
    prisma.application.count({ where: { status: "rejected" } }),
  ]);

  return NextResponse.json({ applications, stats: { total, pending, accepted, rejected } });
}
