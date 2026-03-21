import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, slug, excerpt, content, category, published, tags } = await req.json();

  if (!title || !slug || !excerpt || !content) {
    return NextResponse.json({ error: "필수 항목을 모두 입력해주세요." }, { status: 400 });
  }

  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "이미 사용 중인 슬러그입니다." }, { status: 400 });
  }

  // Upsert tags
  const tagObjects = await Promise.all(
    (tags as string[]).map((name) =>
      prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
    )
  );

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      category: category ?? "활동",
      published: published ?? false,
      authorId: session.user.id,
      tags: {
        create: tagObjects.map((t) => ({ tagId: t.id })),
      },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
