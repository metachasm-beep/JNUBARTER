"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Video, CheckCircle2, GraduationCap, Package, Briefcase, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProfileSchema } from "@/lib/schemas";
import { atomicSyncUser } from "@/lib/barter-sync";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [school, setSchool] = useState<string>("");
  const [hostel, setHostel] = useState<string>("");
  
  const [offerTitle, setOfferTitle] = useState<string>("");
  const [category, setCategory] = useState<"SERVICE" | "COMMODITY">("SERVICE");
  const [effort, setEffort] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [condition, setCondition] = useState<string>("GOOD");
  
  const [offers, setOffers] = useState<{title: string, category: "SERVICE" | "COMMODITY", effort?: any, condition?: string, tags: string[]}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const StepCard = ({ num, title, description, children, isCompleted }: any) => (
    <motion.div 
      initial={false}
      animate={{ 
        height: step === num ? "auto" : "75px",
        opacity: step >= num ? 1 : 0.6
      }}
      className={`overflow-hidden rounded-3xl border-2 transition-all duration-500 mb-4 ${
        step === num ? "border-primary/20 bg-primary/[0.01]" : "border-zinc-100 bg-white"
      }`}
    >
      <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => step > num && setStep(num)}>
        <div className="flex items-center gap-4">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${isCompleted ? "bg-primary border-primary text-white" : "border-zinc-200 text-zinc-400"}`}>
            {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[10px] font-bold">{num}</span>}
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-tight text-zinc-800">{title}</h3>
            {step !== num && <p className="text-[9px] text-zinc-400 uppercase font-bold">{description}</p>}
          </div>
        </div>
        {step !== num && step > num && <Button variant="ghost" size="sm" className="text-[9px] uppercase font-bold text-primary">Modify</Button>}
      </div>
      <AnimatePresence>
        {step === num && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 pb-6">{children}</motion.div>}
      </AnimatePresence>
    </motion.div>
  );

  const addOffer = () => {
    if (offerTitle) {
      setOffers([...offers, { 
        title: offerTitle.toUpperCase(), 
        category, 
        effort: category === "SERVICE" ? effort : undefined,
        condition: category === "COMMODITY" ? condition : undefined,
        tags: [] 
      }]);
      setOfferTitle("");
    }
  };

  const removeOffer = (idx: number) => {
    setOffers(offers.filter((_, i) => i !== idx));
  };

  const handleLaunch = async () => {
    setIsLoading(true);
    const mockUserId = "jnu_user_" + Math.random().toString(36).substr(2, 9);
    const validation = ProfileSchema.safeParse({ 
        userId: mockUserId, name, bio, school, hostel, offers, wants: [] 
    });

    if (!validation.success) {
      toast.error("IDENTITY ERROR: " + validation.error.issues[0].message);
      setIsLoading(false);
      return;
    }

    try {
      await atomicSyncUser(validation.data as any);
      toast.success("CAMPUS IDENTITY DEPLOYED");
      window.location.href = '/';
    } catch (error: any) {
      toast.error("PROTOCOL SYNC FAILED");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans p-6 max-w-2xl mx-auto pb-40">
      <header className="mb-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <GraduationCap className="h-6 w-6 text-white" />
           </div>
           <div>
              <h1 className="text-2xl font-black tracking-tighter text-zinc-800 uppercase italic">JNU BARTER</h1>
              <p className="text-[8px] font-bold text-primary tracking-[0.3em] uppercase">Protocol v2.5 // Registry</p>
           </div>
        </div>
      </header>

      <main>
        <StepCard num={1} title="Campus Profile" description="Basic student metadata" isCompleted={step > 1}>
           <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label className="uppercase text-[9px] font-bold text-zinc-400">Student Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="E.G. ROHAN V." className="rounded-2xl border-zinc-100 bg-zinc-50 h-12 text-xs font-bold" />
                 </div>
                 <div className="space-y-2">
                    <Label className="uppercase text-[9px] font-bold text-zinc-400">School/Dept</Label>
                    <Input value={school} onChange={(e) => setSchool(e.target.value.toUpperCase())} placeholder="E.G. SIS" className="rounded-2xl border-zinc-100 bg-zinc-50 h-12 text-xs font-bold" />
                 </div>
              </div>
              <div className="space-y-2">
                 <Label className="uppercase text-[9px] font-bold text-zinc-400">Hostel (Optional)</Label>
                 <Input value={hostel} onChange={(e) => setHostel(e.target.value.toUpperCase())} placeholder="E.G. TAPTI" className="rounded-2xl border-zinc-100 bg-zinc-50 h-12 text-xs font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="uppercase text-[9px] font-bold text-zinc-400">Bio / Research Focus</Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="WHAT ARE YOU SPECIALIZING IN?" className="rounded-2xl border-zinc-100 bg-zinc-50 min-h-[80px] text-xs" />
              </div>
              <Button onClick={() => setStep(2)} className="w-full h-14 rounded-2xl bg-primary text-white font-bold uppercase tracking-widest text-xs">Proceed to Registry</Button>
           </div>
        </StepCard>

        <StepCard num={2} title="Offer Registry" description="Services & Commodities" isCompleted={step > 2}>
           <div className="space-y-8 pt-4">
              <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 space-y-6">
                 <div className="flex gap-2">
                    <Button 
                        variant={category === "SERVICE" ? "default" : "outline"}
                        onClick={() => setCategory("SERVICE")}
                        className="flex-1 rounded-xl h-10 text-[9px] font-bold uppercase tracking-widest"
                    >
                        <Briefcase className="h-3 w-3 mr-2" /> Service
                    </Button>
                    <Button 
                        variant={category === "COMMODITY" ? "default" : "outline"}
                        onClick={() => setCategory("COMMODITY")}
                        className="flex-1 rounded-xl h-10 text-[9px] font-bold uppercase tracking-widest"
                    >
                        <Package className="h-3 w-3 mr-2" /> Commodity
                    </Button>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-2">
                       <Label className="uppercase text-[9px] font-bold text-zinc-400">Title</Label>
                       <Input value={offerTitle} onChange={(e) => setOfferTitle(e.target.value)} placeholder={category === "SERVICE" ? "E.G. PYTHON TUTORING" : "E.G. STATS TEXTBOOK"} className="rounded-xl border-zinc-200 bg-white h-12 text-xs font-bold" />
                    </div>
                    
                    {category === "SERVICE" ? (
                       <div className="space-y-2">
                          <Label className="uppercase text-[9px] font-bold text-zinc-400">Effort Level</Label>
                          <Select value={effort} onValueChange={setEffort as any}>
                            <SelectTrigger className="rounded-xl h-12 bg-white border-zinc-200 text-xs">
                               <SelectValue placeholder="Select Effort" />
                            </SelectTrigger>
                            <SelectContent>
                               <SelectItem value="LOW">LOW (1-2 HOURS)</SelectItem>
                               <SelectItem value="MEDIUM">MEDIUM (SESSIONS)</SelectItem>
                               <SelectItem value="HIGH">HIGH (PROJECT-BASED)</SelectItem>
                            </SelectContent>
                          </Select>
                       </div>
                    ) : (
                       <div className="space-y-2">
                          <Label className="uppercase text-[9px] font-bold text-zinc-400">Item Condition</Label>
                          <Input value={condition} onChange={(e) => setCondition(e.target.value.toUpperCase())} placeholder="E.G. LIKE NEW" className="rounded-xl border-zinc-200 bg-white h-12 text-xs font-bold" />
                       </div>
                    )}
                    
                    <Button onClick={addOffer} className="w-full h-12 rounded-xl bg-zinc-900 text-white font-bold uppercase text-[9px] tracking-widest">
                       Add to Profile Registry
                    </Button>
                 </div>
              </div>

              <div className="space-y-3">
                 <Label className="uppercase text-[9px] font-bold text-zinc-400 tracking-widest">Profile Listings ({offers.length})</Label>
                 <div className="space-y-2">
                    {offers.map((offer, idx) => (
                       <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-100 shadow-sm">
                          <div className="flex items-center gap-4">
                             <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center">
                                {offer.category === "SERVICE" ? <Briefcase className="h-4 w-4 text-primary" /> : <Package className="h-4 w-4 text-primary" />}
                             </div>
                             <div>
                                <p className="text-[10px] font-black tracking-tight text-zinc-800">{offer.title}</p>
                                <p className="text-[8px] text-zinc-400 font-bold uppercase">{offer.category} // {offer.effort || offer.condition}</p>
                             </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeOffer(idx)} className="text-zinc-300 hover:text-red-500">
                             <Trash2 className="h-4 w-4" />
                          </Button>
                       </div>
                    ))}
                 </div>
              </div>

              <Button onClick={() => setStep(3)} className="w-full h-14 rounded-2xl bg-primary text-white font-bold uppercase tracking-widest text-xs">Finalize Registry</Button>
           </div>
        </StepCard>

        <StepCard num={3} title="Zero-Money Policy" description="Verification & Deployment" isCompleted={isLoading}>
           <div className="space-y-8 pt-4">
              <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 space-y-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary">JNU BARTER PROTOCOL</h4>
                </div>
                <p className="text-[10px] text-zinc-600 leading-relaxed font-bold uppercase">
                  BY DEPLOYING THIS NODE, YOU AGREE THAT ALL EXCHANGES ON THIS PLATFORM ARE STRICTLY NON-MONETARY. ANY ATTEMPT TO SOLICIT CURRENCY WILL RESULT IN IMMEDIATE NODE TERMINATION.
                </p>
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                   <span className="text-[8px] font-mono uppercase text-zinc-400">Zero-Money Integrity Active</span>
                </div>
              </div>
              <Button onClick={handleLaunch} disabled={isLoading} className="w-full h-20 rounded-3xl bg-primary text-white font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/30">
                {isLoading ? "Synchronizing..." : "Deploy to Campus Registry"}
              </Button>
           </div>
        </StepCard>
      </main>
    </div>
  );
}
