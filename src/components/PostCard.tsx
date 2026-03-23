import Link from "next/link";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    coverImage?: string | null;
    createdAt: Date;
    author: { name: string };
    tags: { tag: { name: string } }[];
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/activities/${post.slug}`}
      className="group block bg-navy-900 rounded-2xl overflow-hidden hover:bg-navy-800/80 transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col"
    >
      {/* Thumbnail */}
      <div className="aspect-video overflow-hidden bg-navy-950 flex-shrink-0">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-950/60 to-navy-900">
            <span className="text-white/5 text-7xl font-black tracking-tighter select-none">이음</span>
          </div>
        )}
      </div>

      {/* Tags + content */}
      <div className="flex flex-col flex-1 p-4">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 4).map(({ tag }) => (
              <span
                key={tag.name}
                className="text-xs px-2.5 py-0.5 bg-white/5 text-zinc-400 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-bold text-white leading-snug line-clamp-2 group-hover:text-primary-400 transition-colors mb-2 text-base">
          {post.title}
        </h3>
        <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed flex-1">{post.excerpt}</p>
      </div>
    </Link>
  );
}
