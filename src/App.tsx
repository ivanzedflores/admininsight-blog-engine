import { useState, useEffect } from "react";
import { BlogPost } from "./types";
import { BlogCard } from "./components/BlogCard";
import { ArticleView } from "./components/ArticleView";
import { AdminPanel } from "./components/AdminPanel";
import { cn } from "./utils/cn";
import { motion, AnimatePresence } from "motion/react";
import { LayoutGrid, BookOpen, Settings, Sparkles, Search, Bell, LogIn, LogOut } from "lucide-react";
import { auth } from "./firebase";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";

const INITIAL_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Multi-modal AI Interfaces",
    excerpt: "Exploring how Gemini 1.5 Pro is redefining the way we interact with digital systems through text, image, and video.",
    content: `
# The Future of Multi-modal AI Interfaces

In the rapidly evolving landscape of artificial intelligence, the shift from single-mode models to multi-modal powerhouses like **Gemini 1.5 Pro** marks a significant milestone. This transition isn't just about processing different types of data; it's about understanding the context that connects them.

## Why Multi-modal Matters

Traditional AI models were often siloed. A text model understood language, while a vision model understood pixels. Multi-modal models bridge this gap, allowing for:

*   **Contextual Understanding**: Analyzing a video while referencing a technical manual.
*   **Creative Workflows**: Generating code from a whiteboard sketch.
*   **Enhanced Accessibility**: Real-time translation and description of visual environments.

## The Role of Gemini 1.5 Pro

Gemini 1.5 Pro introduces a massive context window, enabling it to process hours of video or thousands of lines of code in a single prompt. This capability is transformative for professional workflows, where information is often scattered across various formats.

### Key Takeaways

1.  **Efficiency**: Drastically reduces the time needed to synthesize complex information.
2.  **Accuracy**: Better reasoning by cross-referencing multiple data sources.
3.  **Innovation**: Opens doors for entirely new types of applications that were previously impossible.

As we continue to integrate these models into our daily tools, the boundary between human intent and machine execution will continue to blur, leading to a more intuitive and powerful digital experience.
    `,
    author: "Admin Assistant",
    date: "2024-03-01T10:00:00Z",
    imageUrl: "https://picsum.photos/seed/ai-future/1920/1080",
    tags: ["AI", "Gemini", "Multi-modal"],
  },
  {
    id: "2",
    title: "Optimizing Professional Workflows with LLMs",
    excerpt: "A deep dive into how large language models are streamlining technical documentation and community management.",
    content: `
# Optimizing Professional Workflows with LLMs

Large Language Models (LLMs) are no longer just experimental toys; they are becoming the backbone of professional productivity. From automating repetitive tasks to providing deep insights into complex data, LLMs are reshaping the modern workplace.

## Automation and Beyond

The most immediate benefit of LLMs is automation. Tasks like summarizing meetings, drafting emails, and generating boilerplate code can now be handled in seconds. However, the real power lies in **augmentation**.

### Augmenting Human Intelligence

LLMs act as a "second brain," helping professionals:

*   **Synthesize Information**: Quickly extract key points from long reports.
*   **Brainstorm Ideas**: Generate creative solutions for technical problems.
*   **Improve Quality**: Proofread and refine technical documentation for clarity and tone.

## Best Practices for Integration

To truly benefit from LLMs, organizations should focus on:

1.  **Prompt Engineering**: Learning how to communicate effectively with the model.
2.  **Human-in-the-loop**: Ensuring that AI-generated content is always reviewed by a human expert.
3.  **Data Privacy**: Using secure environments to protect sensitive information.

The integration of LLMs into professional workflows is not about replacing humans; it's about empowering them to focus on higher-level strategic thinking and creativity.
    `,
    author: "Admin Assistant",
    date: "2024-02-28T14:30:00Z",
    imageUrl: "https://picsum.photos/seed/workflow/1920/1080",
    tags: ["Workflows", "Productivity", "LLM"],
  },
];

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState<"feed" | "admin">("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser && activeTab === 'admin') {
        setActiveTab('feed');
      }
    });
    return () => unsubscribe();
  }, [activeTab]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account"
    });
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveTab("feed");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const filteredPosts = posts.filter(
    (post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || 
                              post.tags.some((tag) => tag.toLowerCase() === selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    }
  );

  const handlePostCreated = (newPost: BlogPost) => {
    setPosts([newPost, ...posts]);
    setActiveTab("feed");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { setSelectedPost(null); setActiveTab("feed"); }}>
              <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                <Sparkles className="w-5 h-5 text-zinc-900" />
              </div>
              <span className="text-lg font-medium tracking-tight">AdminInsight</span>
            </div>

            <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full">
              <button
                onClick={() => { setActiveTab("feed"); setSelectedPost(null); }}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
                  activeTab === "feed" ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-100"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Feed
              </button>
              {user && (
                <button
                  onClick={() => { setActiveTab("admin"); setSelectedPost(null); }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
                    activeTab === "admin" ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-100"
                  )}
                >
                  <Settings className="w-3.5 h-3.5" />
                  Admin
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-transparent rounded-full pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all w-64 text-zinc-100"
              />
            </div>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
              <Bell className="w-5 h-5 text-zinc-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-zinc-900" />
            </button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-emerald-500/20"
                />
                <button 
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-all border border-emerald-500/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {selectedPost ? (
            <ArticleView key="article" post={selectedPost} onBack={() => setSelectedPost(null)} />
          ) : activeTab === "feed" ? (
            <motion.div
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                    <BookOpen className="w-4 h-4" />
                    Latest Updates
                  </div>
                  <h2 className="text-4xl font-medium tracking-tight text-zinc-100">The Knowledge Feed</h2>
                  <p className="text-zinc-500 text-sm max-w-lg">
                    Curated insights on artificial intelligence, product strategy, and the future of professional workflows.
                  </p>
                </div>
                <div className="flex gap-2">
                  {["All", "AI", "Workflows", "Productivity"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedCategory(filter)}
                      className={cn(
                        "px-4 py-2 rounded-full text-xs font-medium border transition-all",
                        selectedCategory === filter 
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" 
                          : "bg-zinc-900 border-white/5 hover:border-white/20 text-zinc-400 hover:text-zinc-100"
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} onClick={setSelectedPost} />
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-zinc-900 border border-white/5 rounded-3xl">
                  <Search className="w-12 h-12 text-zinc-800 mb-4" />
                  <h3 className="text-lg font-medium text-zinc-100">No posts found</h3>
                  <p className="text-zinc-500 text-sm">Try adjusting your search query.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-12">
                <h2 className="text-3xl font-medium tracking-tight mb-2 text-zinc-100">Admin Dashboard</h2>
                <p className="text-zinc-500 text-sm">Manage your content and analyze community feedback.</p>
              </div>
              <AdminPanel onPostCreated={handlePostCreated} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/5 py-12 px-6 bg-zinc-900 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Sparkles className="w-4 h-4 text-zinc-100" />
            <span className="text-sm font-medium tracking-tight text-zinc-100">AdminInsight</span>
          </div>
          <div className="flex gap-8 text-xs font-medium text-zinc-500 uppercase tracking-widest">
            <a href="#" className="hover:text-zinc-100 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-100 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-100 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-zinc-500">
            © 2024 AdminInsight Blog Engine. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
