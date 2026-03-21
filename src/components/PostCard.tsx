import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, User } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    createdAt: Date;
    author: { name: string };
    tags: { tag: { name: string } }[];
  };
}

const categoryBadge: Record<string, string> = {
  활동: "bg-blue-950/60 text-blue-400 border-blue-800/50",
  프로젝트: "bg-primary-950/60 text-primary-400 border-primary-800/50",
  공지: "bg-amber-950/60 text-amber-400 border-amber-800/50",
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/activities/${post.slug}`}
      className="card group hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Top accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-primary-600 via-primary-400 to-violet-500" />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${categoryBadge[post.category] ?? "bg-zinc-800/60 text-zinc-400 border-zinc-700/50"}`}
          >
            {post.category}
          </span>
        </div>
        <h3 className="font-bold text-white text-lg mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center gap-3 text-xs text-zinc-600">
          <span className="flex items-center gap-1">
            <User size={12} />
            {post.author.name}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {format(new Date(post.createdAt), "yyyy. M. d.", { locale: ko })}
          </span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 3).map(({ tag }) => (
              <span key={tag.name} className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-500 rounded-full">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
