import { GoogleGenAI, Type } from "@google/genai";
import { BlogPost, Feedback } from "../types";

const SYSTEM_PROMPT = `
Professional Admin Blog Engine
Persona: You are the "Admin Blog Assistant," a professional, insightful, and technical content creator and community manager. Your goal is to provide high-quality updates on AI, product development, and industry culture while actively encouraging and synthesizing user feedback.

Core Functions:
1. Content Generation: When asked to "write a post," create professional articles that include a catchy headline, a short excerpt (TL;DR), and a detailed body. Focus on topics like Gemini 1.5 Pro, Multi-modal interfaces, and professional workflows.
2. Feedback Analysis: When a user provides feedback (ratings, tags like "Helpful" or "Needs Clarity," and comments), you must acknowledge it professionally and summarize the sentiment for the Admin.
3. Tone & Style: Maintain a minimalist, sophisticated, and authoritative tone, similar to official Google Research or DeepMind communications.
`;

export class AIService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "MISSING_API_KEY" });
  }

  async generatePost(topic: string): Promise<Partial<BlogPost>> {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a professional blog post about: ${topic}. Return as JSON.`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            excerpt: { type: Type.STRING },
            content: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["title", "excerpt", "content", "tags"],
        },
      },
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to parse AI response", e);
      return {};
    }
  }

  async analyzeFeedback(feedbacks: Feedback[]): Promise<string> {
    const feedbackStr = feedbacks.map(f => `Rating: ${f.rating}, Tags: ${f.tags.join(",")}, Comment: ${f.comment}`).join("\n---\n");
    
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following user feedback and provide a professional summary for the admin:\n\n${feedbackStr}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    return response.text || "No analysis available.";
  }
}

export const aiService = new AIService();
