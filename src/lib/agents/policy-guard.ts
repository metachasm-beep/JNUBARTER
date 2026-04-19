/**
 * JNU BARTER: Institutional Policy Guard (IPG)
 * Enforces the "Zero-Money" reciprocity protocol.
 */

const MONETARY_KEYWORDS = [
  "pay", "paying", "cash", "money", "rupees", "inr", "rs", "bucks", "moola", 
  "venmo", "paytm", "gpay", "google pay", "phonepe", "upi", "price", "cost",
  "selling", "buy", "buying", "charge", "fee", "amount"
];

const CURRENCY_SYMBOLS = ["₹", "$", "£", "€"];

export interface PolicyValidationResult {
  isViolating: boolean;
  reason?: string;
  flaggedContent?: string;
}

/**
 * Validates content against the Institutional Non-Monetary Protocol.
 * Uses a hybrid approach: Keyword scanning + Heuristic patterns.
 * (Can be extended to use an LLM for semantic detection).
 */
export async function validatePolicy(content: string): Promise<PolicyValidationResult> {
  const normalized = content.toLowerCase();

  // 1. Keyword Check
  for (const word of MONETARY_KEYWORDS) {
    if (normalized.includes(word)) {
      return {
        isViolating: true,
        reason: "Monetary transaction detected (Keyword matching)",
        flaggedContent: word
      };
    }
  }

  // 2. Symbol Check
  for (const symbol of CURRENCY_SYMBOLS) {
    if (normalized.includes(symbol)) {
      return {
        isViolating: true,
        reason: "Currency symbol detected",
        flaggedContent: symbol
      };
    }
  }

  // 3. Digital Payment Pattern Check (UPI/Phone numbers)
  const upiPattern = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/;
  if (upiPattern.test(normalized)) {
    return {
      isViolating: true,
      reason: "Potential digital payment handle (UPI) detected",
      flaggedContent: "UPI/VPA Handle"
    };
  }

  return { isViolating: false };
}
