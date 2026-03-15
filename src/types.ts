export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
}

export interface Feedback {
  id: string;
  postId: string;
  rating: number;
  tags: string[];
  comment: string;
  date: string;
}

export interface FeedbackSummary {
  averageRating: number;
  topTags: { tag: string; count: number }[];
  sentiment: string;
}
