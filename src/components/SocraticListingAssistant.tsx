"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, CheckCircle2, ChevronRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocraticListingAssistantProps {
  onSelect: (title: string, category: "SERVICE" | "COMMODITY") => void;
}

export function SocraticListingAssistant({ onSelect }: SocraticListingAssistantProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const questions = [
    {
      q: "What scholarly resource is gathering dust on your shelf?",
      options: ["Books", "Lab Equipment", "Study Material", "Not a physical object"],
      type: "COMMODITY"
    },
    {
      q: "What skill have you mastered that a freshman needs?",
      options: ["Drafting", "Coding", "Mathematics", "Language/Translation"],
      type: "SERVICE"
    }
  ];

  const handleOption = (option: string, type: string) => {
    if (option === "Not a physical object") {
      setStep(1);
      return;
    }
    
    // Finalizing with a suggestion
    const suggestions: Record<string, string[]> = {
      "Books": ["Textbooks", "Reference Material", "Literature"],
      "Lab Equipment": ["Scientific Calculator", "Drafting Tools"],
      "Coding": ["Python Tutoring", "React Debugging"],
      "Drafting": ["Thesis Formatting", "Essay Review"]
    };

    const finalTitle = suggestions[option]?.[0] || option;
    onSelect(finalTitle.toUpperCase(), type as any);
  };

  return (
    <div className="p-6 bg-accent/5 border border-accent/10 rounded-3xl space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-[12px] font-black uppercase tracking-tight text-primary italic">Socratic Discovery Assistant</h4>
          <p className="text-[9px] text-accent font-bold uppercase tracking-widest">Identify your scholarly capital</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-3"
        >
          <p className="text-[11px] font-medium text-stone-600 leading-relaxed italic">
            "{questions[step].q}"
          </p>
          <div className="grid grid-cols-1 gap-2">
            {questions[step].options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOption(opt, questions[step].type)}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200 text-[10px] font-black uppercase tracking-tight text-primary hover:border-accent hover:text-accent transition-all group"
              >
                {opt}
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="pt-2 flex items-center gap-2 text-[8px] font-mono font-bold text-stone-400 uppercase tracking-widest">
         <Lightbulb className="h-3 w-3" />
         Every scholar has assets. The protocol helps you find them.
      </div>
    </div>
  );
}
