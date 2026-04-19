import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Enhancement #9 — Sentiment Engine
 * Analyzes network sentiment via messages and vouches.
 */
export const analyzeNetworkSentiment = inngest.createFunction(
  { 
    id: "analyze-network-sentiment", 
    name: "Network Sentiment Analysis",
    triggers: [{ cron: "0 0 * * *" }] // Daily analysis
  },
  async ({ step }: any) => {
    // 1. Fetch samples
    const samples = await step.run("fetch-samples", async () => {
      const messages = await prisma.message.findMany({ take: 50, orderBy: { createdAt: "desc" } });
      const vouches = await prisma.vouch.findMany({ take: 20, orderBy: { createdAt: "desc" } });
      return { 
        text: [...messages.map(m => m.content), ...vouches.map(v => v.content)].join("\n---\n")
      };
    });

    // 2. Analyze
    const sentiment = await step.run("ai-sentiment-audit", async () => {
      const prompt = `
        Analyze the overall sentiment of these peer-to-peer barter interactions:
        ${samples.text}

        Categorize as: VIBRANT, STABLE, or TOXIC.
        Provide a numeric score (0-100) and a brief summary.
        JSON format: { "label": "string", "score": number, "summary": "string" }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : text);
      } catch (err) {
        return { label: "STABLE", score: 50, summary: "Analysis inconclusive." };
      }
    });

    // 3. Save as a system log/audit log
    await step.run("save-sentiment", async () => {
      await prisma.auditLog.create({
        data: {
          action: "SENTIMENT_ANALYSIS",
          entity: "NETWORK",
          metadata: sentiment as any
        }
      });
    });

    return sentiment;
  }
);
