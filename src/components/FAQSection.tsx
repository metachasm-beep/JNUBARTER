"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const FAQ_DATA = [
  {
    q: "What is JNU BARTER?",
    a: "Think of it as a collaborative scholarly network. JNU BARTER is an academic exchange platform where students swap skills and resources without using money. It’s built on a 'reciprocity engine' that connects students who have what others need—whether it’s Python tutoring, book lending, or research assistance."
  },
  {
    q: "Can I use money here?",
    a: "No. The platform is designed to be purely non-monetary. Our system automatically blocks any mention of payments or cash. This ensures that the JNU community remains a space for mutual academic support rather than commercial transactions."
  },
  {
    q: "How do I sign in?",
    a: "You can sign in with any Google account to browse the registry. However, to keep the network secure and exclusive, you can only post your own 'offers' or 'requests' if you verify your official @jnu.ac.in email address."
  },
  {
    q: "What is 'Triangular Trade'?",
    a: "Sometimes a direct swap doesn't work (you want something from Rohan, but Rohan doesn't need your skill). Our 'Godmode' engine finds 3-way loops: You give to Student A, Student A gives to Student B, and Student B gives to you. Everyone gets exactly what they need."
  },
  {
    q: "How safe is the platform?",
    a: "We use a 'Reputation Integrity' system. Every student has a score based on successful swaps and peer reviews. High-reputation nodes are more visible, and verified institutional identity ensures everyone is a genuine member of the JNU community."
  }
];

export function FAQSection() {
  return (
    <section id="faq" className="w-full py-40 bg-transparent px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase font-serif italic drop-shadow-[0_10px_20px_rgba(0,0,0,1)]">Institutional FAQ</h2>
            <p className="text-stone-400 font-medium tracking-tight mt-4 text-lg">layman's guide to the JNU scholarly reciprocity protocol.</p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion className="w-full space-y-4">
            {FAQ_DATA.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-white/5 bg-white/5 backdrop-blur-2xl rounded-3xl px-8 overflow-hidden transition-all hover:bg-white/10">
                <AccordionTrigger className="text-left text-sm md:text-base font-bold uppercase tracking-tight text-white hover:no-underline hover:text-accent transition-all py-6 font-sans border-none">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-stone-400 leading-relaxed font-medium pt-2 pb-8 text-base md:text-lg">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  >
                    {item.a}
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
