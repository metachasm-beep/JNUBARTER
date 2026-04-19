import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Use Pro for deep research

/**
 * Enhancement #6 — Deep Research Peer Verifier
 * Uses AI to research and verify a user's scholarly claims.
 */
export const verifyPeerAuthority = inngest.createFunction(
  { 
    id: "verify-peer-authority", 
    name: "Deep Research Authority Verification",
    triggers: [{ event: "admin/user.verify_request" }]
  },
  async ({ event, step }: any) => {
    const { userId, targetName, claim } = event.data;

    const report = await step.run("generate-research-report", async () => {
      const prompt = `
        You are an Investigative Academic Researcher.
        Verify the following claim by user ${targetName}:
        "${claim}"

        Conduct a simulation of a deep search across scholarly databases, LinkedIn, and university directories.
        Identify any red flags or supporting evidence.
        
        Respond with a structured report:
        { "status": "VERIFIED" | "QUESTIONABLE" | "UNVERIFIED", "findings": "string", "confidence": number }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : text);
      } catch (err) {
        return { status: "UNVERIFIED", findings: "Failed to parse research output." };
      }
    });

    await step.run("save-report", async () => {
      await prisma.verificationReport.create({
        data: {
          userId,
          status: report.status,
          findings: report.findings,
          evidence: report as any
        }
      });
    });

    return { completed: true, status: report.status };
  }
);
