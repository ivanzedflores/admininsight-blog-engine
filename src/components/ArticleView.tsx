import Markdown from "react-markdown";
import { BlogPost } from "../types";
import { format } from "date-fns";
import { ArrowLeft, Clock, Share2, Bookmark } from "lucide-react";
import { motion } from "motion/react";
import { FeedbackSection } from "./FeedbackSection";

interface ArticleViewProps {
  post: BlogPost;
  onBack: () => void;
}

export function ArticleView({ post, onBack }: ArticleViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-100 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Feed
      </button>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          {post.tags.map((tag) => (
            <span key={tag} className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 ml-auto">
            <Clock className="w-3 h-3" />
            <span>5 min read</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-100 mb-6 leading-[1.1]">
          {post.title}
        </h1>

        <div className="flex items-center justify-between py-6 border-y border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-sm font-medium text-zinc-100">
              {post.author[0]}
            </div>
            <div>
              <div className="text-sm font-medium text-zinc-100">{post.author}</div>
              <div className="text-xs text-zinc-500">{format(new Date(post.date), "MMMM d, yyyy")}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <Share2 className="w-4 h-4 text-zinc-400" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <Bookmark className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>
      </header>

      <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-2xl">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <article className="prose prose-invert max-w-none mb-20">
        <div className="markdown-body text-lg leading-relaxed text-zinc-300">
          <Markdown>{post.content}</Markdown>
        </div>
      </article>

      <div className="border-t border-white/10 pt-12">
        <FeedbackSection postId={post.id} />
      </div>
    </motion.div>
  );
}
