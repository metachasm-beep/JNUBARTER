/**
 * JNU BARTER: Institutional Policy Guard (IPG) v2 (Gemini Powered)
 * Enforces the "Zero-Money" reciprocity protocol.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const MONETARY_KEYWORDS = [
  "pay", "paying", "cash", "money", "rupees", "inr", "rs", "bucks", "moola",
  "venmo", "paytm", "gpay", "google pay", "phonepe", "upi", "price", "cost",
  "selling", "buy", "buying", "charge", "fee", "amount",
];

const CURRENCY_SYMBOLS = ["₹", "$", "£", "€"];
const AMBIGUOUS_KEYWORDS = ["buy", "buying", "cost", "price", "fee", "selling"];

export interface PolicyValidationResult {
  isViolating: boolean;
  reason?: string;
  flaggedContent?: string;
  method?: "keyword" | "regex" | "llm" | "clean";
}

const UPI_PATTERN = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/;
const AMOUNT_PATTERN = /\b\d[\d,]*\s*(rs|inr|rupees?|₹|\$|£|€)\b/i;

/**
 * Gemini semantic check (1.5 Flash — Fast & Free)
 */
async function semanticPolicyCheck(
  content: string
): Promise<PolicyValidationResult> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return { isViolating: false, method: "llm" };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are a policy enforcement agent for JNU Barter — a STRICTLY non-monetary academic exchange platform. 
Determine whether the following content attempts to solicit, offer, or imply any form of monetary payment, cash, digital payment (UPI), or financial transaction. 
Academic use of words like "cost of effort" or "buying knowledge" metaphorically is ALLOWED. 
Actual requests for money are VIOLATIONS.

Content: "${content.slice(0, 500)}"

Return JSON: {"violates": boolean, "reason": "short reason"}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    return {
      isViolating: Boolean(parsed.violates),
      reason: parsed.reason ?? "Semantic monetary intent detected",
      flaggedContent: "Gemini-detected",
      method: "llm",
    };
  } catch (err) {
    console.error("[policy-guard] Gemini failed:", err);
    return { isViolating: false, method: "llm" };
  }
}

export async function validatePolicy(
  content: string
): Promise<PolicyValidationResult> {
  const normalized = content.toLowerCase();
  let isAmbiguous = false;

  if (CURRENCY_SYMBOLS.some(s => normalized.includes(s))) {
    return { isViolating: true, reason: "Currency symbol detected", method: "keyword" };
  }

  if (AMOUNT_PATTERN.test(normalized)) {
    return { isViolating: true, reason: "Monetary amount detected", method: "regex" };
  }

  if (UPI_PATTERN.test(normalized)) {
    return { isViolating: true, reason: "Payment handle (UPI) detected", method: "regex" };
  }

  for (const word of MONETARY_KEYWORDS) {
    if (normalized.includes(word)) {
      if (AMBIGUOUS_KEYWORDS.includes(word)) {
        isAmbiguous = true;
        break;
      }
      return { isViolating: true, reason: `Monetary keyword detected: ${word}`, method: "keyword" };
    }
  }

  if (isAmbiguous) {
    return semanticPolicyCheck(content);
  }

  return { isViolating: false, method: "clean" };
}
