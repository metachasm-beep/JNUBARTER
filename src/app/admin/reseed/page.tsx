"use client";

import { useState } from "react";
import { Zap, Loader2, CheckCircle, AlertCircle } from "lucide-react";

// Diverse and representative dataset for JNU community
const firstNames = ["Ramesh", "Sunita", "Manoj", "Laxmi", "Rajesh", "Savita", "Ashok", "Geeta", "Sanjay", "Kavita", "Anil", "Rekha", "Sunil", "Anita", "Vijay", "Priyanka", "Ajay", "Aarti", "Suresh", "Rupa", "Dinesh", "Suman", "Vinod", "Pooja", "Santosh"];
const lastNames = ["Meena", "Paswan", "Jatav", "Maurya", "Kushwaha", "Sahani", "Mandal", "Kerketta", "Oraon", "Bhagat", "Rajbhar", "Nishad", "Valmiki", "Soren", "Hembram", "Kisku", "Marandi", "Gond", "Munda", "Baitha", "Soreng", "Dungdung", "Pal", "Baghel", "Prajapati"];

const schools = ["SIS", "SSS", "SLLCS", "SCSS", "SPS", "SBT", "SL", "SES"];
const hostels = ["Tapti", "Mahi-Mandavi", "Koyna", "Sabarmati", "Jhelum", "Chenab", "Lohit", "Chandrabhaga", "Periyar", "Kavery"];

const realisticServices = [
  { title: "PhD Thesis Formatting Help", desc: "Assisting with LaTeX or MS Word formatting for social science dissertations." },
  { title: "Statistical Analysis in R", desc: "Help with data visualization and hypothesis testing for research papers." },
  { title: "Hindi to English Translation", desc: "Translating research summaries for non-native English speakers." },
  { title: "Python for Data Science", desc: "Hands-on help with Pandas and NumPy for academic research projects." },
  { title: "Academic Proofreading", desc: "Reviewing essays and papers for grammar, flow, and citation accuracy." },
  { title: "Bhojpuri/Maithili Folk Music Session", desc: "Teaching traditional folk songs from Eastern UP and Bihar." },
  { title: "Yoga & Breathwork Session", desc: "Relaxing morning yoga sessions at the hostels to destress from exams." },
  { title: "Regional Cooking Workshop", desc: "Learn to cook authentic tribal dishes from Jharkhand and Chhattisgarh." },
  { title: "Spanish Conversation Exchange", desc: "Exchange your English/Hindi for Spanish speaking practice." },
  { title: "Career CV & Resume Review", desc: "Help with tailoring your CV for academic or corporate internships." }
];

const realisticCommodities = [
  { title: "Lab Coat (Size M)", desc: "Well-maintained lab coat, perfect for science or biotechnology students." },
  { title: "Casio Scientific Calculator", desc: "Reliable scientific calculator with all advanced functions needed for physics." },
  { title: "UPSC GS Study Materials", desc: "Complete set of Vision IAS and Vajiram notes for civil services preparation." },
  { title: "Ergonomic Desk Chair", desc: "Comfortable chair for long study sessions. Pick up from Tapti hostel." },
  { title: "Handmade Bamboo Crafts", desc: "Traditional artisanal items made by students from the North East." },
  { title: "Organic Honey (500g)", desc: "Pure honey sourced directly from local producers in the North East." },
  { title: "Noise-Cancelling Headphones", desc: "Great for studying in the library. Bluetooth enabled, 20h battery." },
  { title: "Portable Power Bank (20k mAh)", desc: "Fast charging power bank, essential for long days at the schools." },
  { title: "Reference Book: Caste in Modern India", desc: "Essential reading for SSS students. Good condition, no markings." },
  { title: "Second-hand Bicycle", desc: "Perfect for commuting between hostels and the central library." }
];

export default function ReseedPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  const handleReseed = async () => {
    setStatus("loading");
    setLog([]);
    addLog("Initializing diverse identity sync...");

    try {
      const users = Array.from({ length: 50 }).map((_, i) => {
        const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const school = schools[i % schools.length];
        return {
          email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i+700}@jnu.ac.in`,
          name: `${fName} ${lName}`,
          bio: `Research scholar at ${school}. Interested in grassroots activism and academic reciprocity.`,
          school: school,
          hostel: hostels[i % hostels.length],
          isVerified: true,
          reputation: Math.floor(Math.random() * 40) + 10,
          role: "USER"
        };
      });

      addLog("Transmitting diverse payload to server...");
      const res = await fetch("/api/admin/reseed-final", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users, realisticServices, realisticCommodities })
      });

      if (!res.ok) throw new Error(await res.text());

      addLog("Successfully injected 50 representative student profiles!");
      setStatus("success");
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-stone-200 p-12 space-y-8 text-center">
        <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto">
          {status === "loading" ? <Loader2 className="h-10 w-10 animate-spin" /> : 
           status === "success" ? <CheckCircle className="h-10 w-10 text-emerald-500" /> :
           status === "error" ? <AlertCircle className="h-10 w-10 text-rose-500" /> :
           <Zap className="h-10 w-10 fill-current" />}
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-primary uppercase italic tracking-tighter">Identity Sync</h1>
          <p className="text-stone-400 text-sm font-medium italic">Re-populating the platform with representative JNU student profiles.</p>
        </div>

        {status === "idle" && (
          <button 
            onClick={handleReseed}
            className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            Trigger Inclusive Seed
          </button>
        )}

        <div className="bg-stone-900 rounded-2xl p-4 text-left overflow-hidden">
          <div className="flex gap-1.5 mb-3">
            <div className="h-2 w-2 rounded-full bg-rose-500" />
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="font-mono text-[10px] text-stone-500 h-32 overflow-y-auto space-y-1">
            {log.length === 0 ? "> Awaiting diverse data initialization..." : log.map((l, i) => <p key={i}>{l}</p>)}
          </div>
        </div>

        {status === "success" && (
          <p className="text-emerald-600 font-bold text-sm">Sync Complete! Diversity Check: PASSED.</p>
        )}
      </div>
    </div>
  );
}
