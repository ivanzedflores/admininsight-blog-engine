import { useState } from "react";
import { Star, ThumbsUp, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "motion/react";

interface FeedbackSectionProps {
  postId: string;
}

const FEEDBACK_TAGS = ["Helpful", "Insightful", "Needs Clarity", "Too Technical", "Great Examples"];

export function FeedbackSection({ postId }: FeedbackSectionProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send to backend
    console.log("Feedback submitted:", { postId, rating, selectedTags, comment });
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    
    // Reset form
    setRating(0);
    setSelectedTags([]);
    setComment("");
  };

  return (
    <div className="bg-white/5 rounded-3xl p-8 md:p-12">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-5 h-5 text-emerald-400" />
        <h3 className="text-xl font-medium tracking-tight text-zinc-100">Share your feedback</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Rate this article</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-colors",
                    (hoverRating || rating) >= star ? "fill-emerald-500 text-emerald-500" : "text-white/10"
                  )}
                />
              </button>
            ))}
            <span className="ml-3 text-sm font-medium text-zinc-400">
              {rating > 0 ? `${rating} / 5` : "Select a rating"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Quick-action tags</label>
          <div className="flex flex-wrap gap-2">
            {FEEDBACK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-medium transition-all border",
                  selectedTags.includes(tag)
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                    : "bg-white/5 border-white/5 text-zinc-400 hover:border-white/20"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Additional comments</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think? Any questions or suggestions?"
            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all min-h-[120px] resize-none text-zinc-100"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500 italic">Your feedback helps us improve our content.</p>
          <button
            type="submit"
            disabled={rating === 0 && comment.trim() === "" && selectedTags.length === 0}
            className="flex items-center gap-2 bg-zinc-100 text-zinc-900 px-8 py-3 rounded-full text-sm font-semibold hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-zinc-100 disabled:hover:text-zinc-900 group"
          >
            Submit Feedback
            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Feedback submitted successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
