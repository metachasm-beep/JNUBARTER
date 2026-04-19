"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_DATA = [
  {
    q: "What is the foundational objective of JNU BARTER?",
    a: "JNU BARTER is an academic reciprocity engine engineered to facilitate the non-monetary exchange of intellectual labor and physical commodities within the Jawaharlal Nehru University ecosystem. It leverages a graph-theoretic framework to identify optimal bilateral and trilateral trade loops."
  },
  {
    q: "Are fiscal transactions permitted within the protocol?",
    a: "Strictly negative. The platform architecture explicitly prohibits monetary solicitation. All value transfer must be substantive (e.g., peer-tutoring, research assistance) or material (e.g., academic resources). Violation of this 'Zero-Money' axiom results in permanent node termination."
  },
  {
    q: "What are the authentication prerequisites for participation?",
    a: "While the initial gateway supports Google OAuth for baseline identity verification, the privilege to 'Post' or 'Respond' is strictly gated behind JNU Institutional Identity. Users must verify their @jnu.ac.in credentials to engage with the active registry."
  },
  {
    q: "How does the 'Triangular Trade' algorithm function?",
    a: "The backend engine (Godmode) analyzes the vector of 'Intents' across the network. If User A requires Python expertise (offered by B), and B requires a French translation (offered by C), and C requires a specific social science textbook (offered by A), the system automatically synthesizes a trilateral swap to maximize campus utility."
  },
  {
    q: "How is the 'Reputation Score' calculated?",
    a: "Reputation is a dynamic metric weighted by successful transaction finality, peer-vouching integrity, and department-verified contributions. High-reputation nodes receive priority indexing in the Discovery Feed."
  }
];

export function FAQSection() {
  return (
    <section id="faq" className="w-full py-32 bg-white px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic">Institutional FAQ</h2>
          <p className="text-zinc-500 font-medium tracking-tight">Technical specifications and governance protocols for the JNU reciprocity network.</p>
        </div>
        
        <Accordion className="w-full">
          {FAQ_DATA.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-zinc-100 py-2">
              <AccordionTrigger className="text-left text-sm font-bold uppercase tracking-tight text-zinc-800 hover:no-underline hover:text-primary transition-colors">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-zinc-500 leading-relaxed font-medium pt-2 pb-6">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
