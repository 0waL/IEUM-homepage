import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white mb-6">새 게시글 작성</h1>
      <PostForm />
    </div>
  );
}
