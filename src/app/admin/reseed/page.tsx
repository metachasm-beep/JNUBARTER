"use client";

import { useState } from "react";
import { Zap, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const firstNames = ["Arjun", "Priya", "Rahul", "Ananya", "Vikram", "Sneha", "Amit", "Ishita", "Karan", "Pooja", "Siddharth", "Kavita", "Rohan", "Meera", "Aditya", "Zoya", "Manish", "Riya", "Varun", "Tanvi"];
const lastNames = ["Sharma", "Verma", "Iyer", "Singh", "Kapoor", "Gupta", "Reddy", "Malhotra", "Joshi", "Das", "Nair", "Patel", "Chopra", "Deshmukh", "Banerjee", "Khan", "Trivedi", "Menon", "Bose", "Kulkarni"];
const schools = ["SIS", "SSS", "SLLCS", "SCSS", "SPS", "SBT", "SL"];
const hostels = ["Tapti", "Mahi-Mandavi", "Koyna", "Sabarmati", "Jhelum", "Chenab", "Lohit", "Chandrabhaga"];

const realisticServices = [
  { title: "PhD Thesis Formatting Help", desc: "Assisting with LaTeX or MS Word formatting for social science dissertations." },
  { title: "Statistical Analysis in R", desc: "Help with data visualization and hypothesis testing for research papers." },
  { title: "German Language Tutoring", desc: "Beginner to Intermediate German conversation practice for language students." },
  { title: "Python for Data Science", desc: "Hands-on help with Pandas and NumPy for academic research projects." },
  { title: "Academic Proofreading", desc: "Reviewing essays and papers for grammar, flow, and citation accuracy." },
  { title: "React & Next.js Mentorship", desc: "Guided help for building modern web applications for campus projects." },
  { title: "Yoga & Breathwork Session", desc: "Relaxing morning yoga sessions at the hostels to destress from exams." },
  { title: "Digital Portrait Illustration", desc: "Custom digital art and character design for personal or academic use." },
  { title: "Spanish Conversation Exchange", desc: "Exchange your English/Hindi for Spanish speaking practice." },
  { title: "Career CV & Resume Review", desc: "Help with tailoring your CV for academic or corporate internships." }
];

const realisticCommodities = [
  { title: "Lab Coat (Size M)", desc: "Well-maintained lab coat, perfect for science or biotechnology students." },
  { title: "Casio Scientific Calculator", desc: "Reliable scientific calculator with all advanced functions needed for physics." },
  { title: "GRE Prep Books (Kaplan)", desc: "Slightly used GRE study guides with practice tests and strategy notes." },
  { title: "Ergonomic Desk Chair", desc: "Comfortable chair for long study sessions. Pick up from Tapti hostel." },
  { title: "Kindle Paperwhite", desc: "E-reader in excellent condition, pre-loaded with some academic classics." },
  { title: "Handmade Clay Pottery", desc: "Decorative artisanal pots made in the campus hobby workshop." },
  { title: "Organic Honey (500g)", desc: "Pure honey sourced directly from local producers in the North East." },
  { title: "Noise-Cancelling Headphones", desc: "Great for studying in the library. Bluetooth enabled, 20h battery." },
  { title: "Portable Power Bank (20k mAh)", desc: "Fast charging power bank, essential for long days at the schools." },
  { title: "Reference Book: International Relations", desc: "Standard textbook for SIS students. Good condition, no markings." }
];

export default function ReseedPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  const handleReseed = async () => {
    setStatus("loading");
    setLog([]);
    addLog("Starting deep re-seeding...");

    try {
      // 1. Create realistic users and listings data
      const users = Array.from({ length: 50 }).map((_, i) => {
        const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const school = schools[i % schools.length];
        return {
          email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i+500}@jnu.ac.in`,
          name: `${fName} ${lName}`,
          bio: `Research scholar at ${school}. Passionate about academic reciprocity and peer support.`,
          school: school,
          hostel: hostels[i % hostels.length],
          isVerified: true,
          reputation: Math.floor(Math.random() * 50) + 10,
          role: "USER"
        };
      });

      // 2. We use a hidden API that we will create to handle the heavy DB lifting
      addLog("Transmitting seeding payload to server...");
      const res = await fetch("/api/admin/reseed-final", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users, realisticServices, realisticCommodities })
      });

      if (!res.ok) throw new Error(await res.text());

      addLog("Successfully injected 50 realistic users and 50 listings!");
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
          <p className="text-stone-400 text-sm font-medium">Re-populating the platform with realistic scholarly profiles and listings.</p>
        </div>

        {status === "idle" && (
          <button 
            onClick={handleReseed}
            className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            Trigger Final Seed
          </button>
        )}

        <div className="bg-stone-900 rounded-2xl p-4 text-left overflow-hidden">
          <div className="flex gap-1.5 mb-3">
            <div className="h-2 w-2 rounded-full bg-rose-500" />
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="font-mono text-[10px] text-stone-500 h-32 overflow-y-auto space-y-1">
            {log.length === 0 ? "> Ready to initialize sync sequence..." : log.map((l, i) => <p key={i}>{l}</p>)}
          </div>
        </div>

        {status === "success" && (
          <p className="text-emerald-600 font-bold text-sm">Sync Complete! Check your dashboard.</p>
        )}
      </div>
    </div>
  );
}
