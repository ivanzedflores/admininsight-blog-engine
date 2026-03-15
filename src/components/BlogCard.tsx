import { BlogPost } from "../types";
import { cn } from "../utils/cn";
import { format } from "date-fns";
import { ArrowRight, Tag } from "lucide-react";
import { motion } from "motion/react";

interface BlogCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
}

export function BlogCard({ post, onClick }: BlogCardProps) {
  return (
    <motion.div
      layoutId={`post-${post.id}`}
      onClick={() => onClick(post)}
      className="group relative flex flex-col overflow-hidden bg-zinc-900 border border-white/5 hover:border-white/10 transition-all cursor-pointer rounded-2xl shadow-sm hover:shadow-md"
      whileHover={{ y: -4 }}
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            {format(new Date(post.date), "MMM d, yyyy")}
          </span>
          <span className="text-white/10">•</span>
          <div className="flex gap-1">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] font-medium uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-medium tracking-tight text-zinc-100 mb-3 group-hover:text-emerald-400 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-sm text-zinc-400 line-clamp-2 mb-6 flex-grow leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <span className="text-xs font-medium text-zinc-500 italic">
            By {post.author}
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-zinc-100 group-hover:translate-x-1 transition-transform">
            Read Post <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
