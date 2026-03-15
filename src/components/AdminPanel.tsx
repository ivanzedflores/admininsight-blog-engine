import { useState } from "react";
import { aiService } from "../services/ai";
import { BlogPost } from "../types";
import { Sparkles, Loader2, Plus, RefreshCw, BarChart3, MessageSquare } from "lucide-react";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  onPostCreated: (post: BlogPost) => void;
}

export function AdminPanel({ onPostCreated }: AdminPanelProps) {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const partialPost = await aiService.generatePost(topic);
      const newPost: BlogPost = {
        id: Math.random().toString(36).substr(2, 9),
        title: partialPost.title || "Untitled Post",
        excerpt: partialPost.excerpt || "No excerpt available.",
        content: partialPost.content || "No content available.",
        author: "Admin Assistant",
        date: new Date().toISOString(),
        imageUrl: `https://picsum.photos/seed/${Math.random()}/1920/1080`,
        tags: partialPost.tags || ["AI", "Innovation"],
      };
      onPostCreated(newPost);
      setTopic("");
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeFeedback = async () => {
    setIsAnalyzing(true);
    try {
      // Mock feedbacks for now
      const mockFeedbacks = [
        { id: "1", postId: "1", rating: 5, tags: ["Helpful"], comment: "Great post!", date: new Date().toISOString() },
        { id: "2", postId: "1", rating: 3, tags: ["Needs Clarity"], comment: "A bit too technical.", date: new Date().toISOString() },
      ];
      const result = await aiService.analyzeFeedback(mockFeedbacks);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xl font-medium tracking-tight text-zinc-100">Generate New Post</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Post Topic</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., The impact of Gemini 1.5 Pro on creative workflows"
                className="flex-grow bg-white/5 border border-transparent rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-zinc-100"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className="flex items-center gap-2 bg-zinc-100 text-zinc-900 px-8 py-4 rounded-2xl text-sm font-semibold hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-zinc-100 disabled:hover:text-zinc-900 group whitespace-nowrap"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                )}
                Generate Post
              </button>
            </div>
          </div>
          <p className="text-xs text-zinc-500 italic">
            The AI will generate a headline, TL;DR, and full body content based on your topic.
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-medium tracking-tight text-zinc-100">Feedback Insights</h3>
          </div>
          <button
            onClick={handleAnalyzeFeedback}
            disabled={isAnalyzing}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-zinc-100 transition-colors group"
          >
            {isAnalyzing ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
            )}
            Analyze Recent Feedback
          </button>
        </div>

        <AnimatePresence mode="wait">
          {analysis ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">AI Summary</span>
              </div>
              <p className="text-sm text-emerald-100/80 leading-relaxed whitespace-pre-wrap">
                {analysis}
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
              <BarChart3 className="w-8 h-8 text-white/5 mb-4" />
              <p className="text-sm text-zinc-500">No analysis generated yet.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
