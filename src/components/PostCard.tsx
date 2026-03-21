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

const categoryColors: Record<string, string> = {
  활동: "bg-blue-50 text-blue-700",
  프로젝트: "bg-purple-50 text-purple-700",
  공지: "bg-orange-50 text-orange-700",
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/activities/${post.slug}`} className="card group hover:shadow-md transition-shadow">
      {/* Category banner */}
      <div className="h-2 bg-gradient-to-r from-primary-500 to-primary-700" />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[post.category] ?? "bg-gray-50 text-gray-600"}`}
          >
            {post.category}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
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
              <span key={tag.name} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
