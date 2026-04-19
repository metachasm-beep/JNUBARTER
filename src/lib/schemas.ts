import { z } from "zod";

export const ProfileSchema = z.object({
  userId: z.string(),
  name: z.string().min(2, "Name is required"),
  bio: z.string().max(500),
  school: z.string().optional(),
  hostel: z.string().optional(),
  program: z.string().optional(),
  year: z.string().optional(),
  offers: z.array(z.object({
    title: z.string().min(3),
    category: z.enum(["SERVICE", "COMMODITY"]),
    effort: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    condition: z.string().optional(),
    tags: z.array(z.string())
  })),
  wants: z.array(z.string())
});

export const SwapMessageSchema = z.object({
  id: z.string(),
  sender: z.string(),
  text: z.string().min(1),
  timestamp: z.string(),
  type: z.string()
});

export type SwapMessage = z.infer<typeof SwapMessageSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
