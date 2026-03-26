export const dynamic = "force-dynamic";
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

  const { title, slug, excerpt, content, category, published, tags, coverImage } = await req.json();

  // Check slug uniqueness (excluding self)
  const existing = await prisma.post.findFirst({
    where: { slug, NOT: { id: params.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "이미 사용 중인 슬러그입니다." }, { status: 400 });
  }

  // Upsert tags
  const tagObjects = await Promise.all(
    (tags as string[]).map((name) =>
      prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
    )
  );

  // Delete old tag relations
  await prisma.postTag.deleteMany({ where: { postId: params.id } });

  const post = await prisma.post.update({
    where: { id: params.id },
    data: {
      title,
      slug,
      excerpt,
      content,
      category: category ?? "활동",
      published: published ?? false,
      coverImage: coverImage ?? null,
      tags: {
        create: tagObjects.map((t) => ({ tagId: t.id })),
      },
    },
  });

  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const post = await prisma.post.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
