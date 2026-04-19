import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Enhancement #1 — Safety Guard & Policy Audit
 * Automatically scans new listings for "Zero-Money" policy violations.
 */
export const auditListingPolicy = inngest.createFunction(
  { 
    id: "audit-listing-policy", 
    name: "Listing Policy Audit (AI Guard)",
    triggers: [{ event: "barter/listing.created" }]
  },
  async ({ event, step }: any) => {
    const { listingId, title, description } = event.data;

    const auditResult = await step.run("ai-policy-check", async () => {
      const prompt = `
        You are an AI Policy Guard for a "Zero-Money" barter platform.
        Analyze the following listing:
        Title: ${title}
        Description: ${description}

        Rules:
        1. No cash, UPI, or fiat currency mentioned as payment.
        2. No crypto or external tokens.
        3. No illegal services or items.
        4. No "price" or "fees" in currency.

        Does this listing violate any rules? 
        Respond in JSON format: { "isViolating": boolean, "reason": "string" }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      try {
        // Simple regex to extract JSON if model adds markdown wrappers
        const jsonMatch = text.match(/\{.*\}/s);
        return JSON.parse(jsonMatch ? jsonMatch[0] : text);
      } catch (err) {
        return { isViolating: false, reason: "Analysis failed" };
      }
    });

    if (auditResult.isViolating) {
      await step.run("flag-listing", async () => {
        await prisma.listing.update({
          where: { id: listingId },
          data: {
            isFlagged: true,
            flagReason: auditResult.reason,
          },
        });
      });
    }

    // Enhancement #3 — Log usage for cost tracking
    await step.run("log-token-usage", async () => {
       await prisma.usageLog.create({
         data: {
           feature: "AI_POLICY_AUDIT",
           tokens: 500, // Estimate for flash
           cost: 0.0001,
         }
       });
    });

    return { audited: true, violating: auditResult.isViolating };
  }
);
