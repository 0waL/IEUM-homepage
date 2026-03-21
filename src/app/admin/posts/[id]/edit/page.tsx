import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/admin/PostForm";

interface Props {
  params: { id: string };
}

export default async function EditPostPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { tags: { include: { tag: true } } },
  });

  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">게시글 수정</h1>
      <PostForm
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          published: post.published,
          tags: post.tags.map((t) => t.tag.name).join(", "),
        }}
      />
    </div>
  );
}
