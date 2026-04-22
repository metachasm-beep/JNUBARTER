"use client";

import { useState } from "react";
import { Zap, Loader2, CheckCircle, AlertCircle } from "lucide-react";

// v2.2 — Enhanced Institutional Dataset with Registry Metadata
const firstNames = ["Ramesh", "Sunita", "Manoj", "Laxmi", "Rajesh", "Savita", "Ashok", "Geeta", "Sanjay", "Kavita", "Anil", "Rekha", "Sunil", "Anita", "Vijay", "Priyanka", "Ajay", "Aarti", "Suresh", "Rupa", "Dinesh", "Suman", "Vinod", "Pooja", "Santosh"];
const lastNames = ["Meena", "Paswan", "Jatav", "Maurya", "Kushwaha", "Sahani", "Mandal", "Kerketta", "Oraon", "Bhagat", "Rajbhar", "Nishad", "Valmiki", "Soren", "Hembram", "Kisku", "Marandi", "Gond", "Munda", "Baitha", "Soreng", "Dungdung", "Pal", "Baghel", "Prajapati"];

const schools = ["SIS", "SSS", "SLLCS", "SCSS", "SPS", "SBT", "SL", "SES"];
const hostels = ["Tapti", "Mahi-Mandavi", "Koyna", "Sabarmati", "Jhelum", "Chenab", "Lohit", "Chandrabhaga", "Periyar", "Kavery"];

const realisticServices = [
  { 
    title: "PhD Thesis Formatting Help", 
    desc: "Assisting with LaTeX or MS Word formatting for social science dissertations, ensuring strict compliance with institutional scholarly standards.",
    tags: ["ACADEMIC", "LATEX", "RESEARCH"]
  },
  { 
    title: "Statistical Analysis in R", 
    desc: "Help with data visualization and hypothesis testing for research papers using advanced R packages and statistical modeling techniques.",
    tags: ["DATA", "STATISTICS", "R-LANG"]
  },
  { 
    title: "Hindi to English Translation", 
    desc: "Translating research summaries and academic abstracts for non-native English speakers to broaden scholarly reach within the network.",
    tags: ["LANGUAGE", "TRANSLATION", "ACADEMIC"]
  },
  { 
    title: "Python for Data Science", 
    desc: "Hands-on mentorship with Pandas, NumPy, and Scikit-learn for academic research projects and computational modeling.",
    tags: ["PYTHON", "DATA-SCIENCE", "CODE"]
  },
  { 
    title: "Academic Proofreading", 
    desc: "Critical review of essays and research papers for grammar, logical flow, and rigorous citation accuracy (APA/MLA/Chicago).",
    tags: ["WRITING", "ACADEMIC", "REVIEW"]
  },
  { 
    title: "Maithili Folk Music Session", 
    desc: "Authentic oral tradition sessions teaching traditional folk songs and rhythmic structures from Eastern Uttar Pradesh and Bihar.",
    tags: ["CULTURE", "MUSIC", "TRADITION"]
  },
  { 
    title: "Yoga & Mindfulness Session", 
    desc: "Restorative morning sessions at hostel lawns focusing on breathwork and stress reduction during high-pressure exam cycles.",
    tags: ["HEALTH", "YOGA", "WELLNESS"]
  },
  { 
    title: "Regional Cooking Workshop", 
    desc: "Immersive culinary session teaching the preparation of authentic tribal dishes from the Jharkhand and Chhattisgarh regions.",
    tags: ["CULTURE", "COOKING", "SOCIAL"]
  },
  { 
    title: "Spanish Language Exchange", 
    desc: "Interactive language exchange focusing on conversational Spanish in return for English or Hindi speaking practice.",
    tags: ["LANGUAGE", "SPANISH", "EXCHANGE"]
  },
  { 
    title: "Career Strategy & CV Review", 
    desc: "Strategic help with tailoring CVs and resumes for high-impact academic fellowships or corporate internships.",
    tags: ["CAREER", "ACADEMIC", "STRATEGY"]
  }
];

const realisticCommodities = [
  { 
    title: "Lab Coat (Size M)", 
    desc: "Well-maintained institutional lab coat, perfect for science, biotechnology, or environmental studies students.",
    tags: ["LAB", "SCIENCE", "GEAR"]
  },
  { 
    title: "Casio Scientific Calculator", 
    desc: "Reliable scientific calculator with 400+ functions, essential for advanced physics and engineering coursework.",
    tags: ["MATH", "TOOLS", "TECH"]
  },
  { 
    title: "UPSC GS Study Materials", 
    desc: "Complete, high-density set of GS notes and mock test papers for civil services preparation (2025 Edition).",
    tags: ["UPSC", "BOOKS", "STUDY"]
  },
  { 
    title: "Ergonomic Desk Chair", 
    desc: "High-comfort ergonomic chair for extended library or hostel study sessions. Excellent lumbar support.",
    tags: ["FURNITURE", "STUDY", "HOSTEL"]
  },
  { 
    title: "Handmade Bamboo Crafts", 
    desc: "Traditional artisanal crafts and decor items made by students from the North East community. Authentic craftsmanship.",
    tags: ["ART", "CULTURE", "DECOR"]
  },
  { 
    title: "Organic Wild Honey (500g)", 
    desc: "Pure, unprocessed honey sourced directly from sustainable local producers in the North East forest regions.",
    tags: ["FOOD", "ORGANIC", "NORTHEAST"]
  },
  { 
    title: "Noise-Cancelling Headphones", 
    desc: "Premium wireless headphones optimized for deep focus in crowded libraries. Active noise cancellation enabled.",
    tags: ["TECH", "FOCUS", "STUDY"]
  },
  { 
    title: "Portable Power Bank (20k mAh)", 
    desc: "Rugged, fast-charging power bank with high capacity, essential for long field research or library days.",
    tags: ["TECH", "POWER", "TOOLS"]
  },
  { 
    title: "Reference: Caste in Modern India", 
    desc: "Essential sociopolitical text for SSS curriculum. Pristine condition with no markings or spine damage.",
    tags: ["BOOKS", "SOCIOLOGY", "ACADEMIC"]
  },
  { 
    title: "Network-Verified Bicycle", 
    desc: "Sturdy campus commuter bicycle in excellent mechanical condition. Perfect for hostel-to-school transit.",
    tags: ["TRANSIT", "BICYCLE", "CAMPUS"]
  }
];

export default function ReseedPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  const handleReseed = async () => {
    setStatus("loading");
    setLog([]);
    addLog("Initializing high-fidelity institutional sync v2.2...");

    try {
      const users = Array.from({ length: 50 }).map((_, i) => {
        const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const school = schools[i % schools.length];
        return {
          email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i+1200}@jnu.ac.in`,
          name: `${fName} ${lName}`,
          bio: `Research scholar at ${school}. Dedicated to academic reciprocity and peer-to-peer knowledge exchange.`,
          school: school,
          hostel: hostels[i % hostels.length],
          isVerified: true,
          reputation: Math.floor(Math.random() * 40) + 10,
          role: "USER"
        };
      });

      addLog("Transmitting enriched metadata payload...");
      const res = await fetch("/api/admin/reseed-final", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users, realisticServices, realisticCommodities, forceClean: true })
      });

      if (!res.ok) throw new Error(await res.text());

      addLog("Successfully injected 50 profiles with registry metadata!");
      setStatus("success");
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-stone-200 p-12 space-y-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <span className="text-[8px] font-mono font-bold text-stone-300 uppercase tracking-widest bg-stone-50 px-3 py-1 rounded-full">v2.2 Enriched</span>
        </div>

        <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto">
          {status === "loading" ? <Loader2 className="h-10 w-10 animate-spin" /> : 
           status === "success" ? <CheckCircle className="h-10 w-10 text-emerald-500" /> :
           status === "error" ? <AlertCircle className="h-10 w-10 text-rose-500" /> :
           <Zap className="h-10 w-10 fill-current" />}
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-primary uppercase italic tracking-tighter">Metadata Sync</h1>
          <p className="text-stone-400 text-sm font-medium italic">Seeding high-fidelity academic listings with complete registry metadata.</p>
        </div>

        {status === "idle" && (
          <button 
            onClick={handleReseed}
            className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            Trigger Enriched Seed
          </button>
        )}

        <div className="bg-stone-900 rounded-2xl p-4 text-left overflow-hidden">
          <div className="flex gap-1.5 mb-3">
            <div className="h-2 w-2 rounded-full bg-rose-500" />
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="font-mono text-[10px] text-stone-500 h-32 overflow-y-auto space-y-1">
            {log.length === 0 ? "> Awaiting metadata initialization..." : log.map((l, i) => <p key={i}>{l}</p>)}
          </div>
        </div>

        {status === "success" && (
          <p className="text-emerald-600 font-bold text-sm">Sync Complete! Metadata Injected: 100%.</p>
        )}
      </div>
    </div>
  );
}
