"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, CheckCircle2, GraduationCap, Package, Briefcase, Trash2, ShieldAlert, X } from "lucide-react";
import { toast } from "sonner";
import { ProfileSchema } from "@/lib/schemas";
import { atomicSyncUser } from "@/lib/barter-sync";
import { motion, AnimatePresence } from "framer-motion";
import { validatePolicy, PolicyValidationResult } from "@/lib/agents/policy-guard";
import { useSession } from "next-auth/react";

interface StepCardProps {
  num: number;
  title: string;
  description: string;
  children: React.ReactNode;
  isCompleted: boolean;
  activeStep: number;
  onStepClick: (num: number) => void;
}

const StepCard = ({ num, title, description, children, isCompleted, activeStep, onStepClick }: StepCardProps) => (
  <motion.div 
    initial={false}
    animate={{ 
      height: activeStep === num ? "auto" : "75px",
      opacity: activeStep >= num ? 1 : 0.6
    }}
    className={`overflow-hidden rounded-3xl border-2 transition-all duration-500 mb-4 ${
      activeStep === num ? "border-accent/20 bg-accent/[0.01]" : "border-stone-100 bg-white"
    }`}
  >
    <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => activeStep > num && onStepClick(num)}>
      <div className="flex items-center gap-4">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted ? "bg-accent border-accent text-white" : "border-stone-200 text-stone-400"}`}>
          {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[10px] font-mono font-bold">{num}</span>}
        </div>
        <div>
          <h3 className="text-sm font-sans font-extrabold uppercase tracking-tight text-primary">{title}</h3>
          {activeStep !== num && <p className="text-[9px] font-mono text-stone-400 uppercase font-bold">{description}</p>}
        </div>
      </div>
      {activeStep !== num && activeStep > num && <Button variant="ghost" size="sm" className="text-[9px] uppercase font-bold text-accent">Modify</Button>}
    </div>
    <AnimatePresence>
      {activeStep === num && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 pb-6">{children}</motion.div>}
    </AnimatePresence>
  </motion.div>
);

interface InitializeNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InitializeNodeModal({ isOpen, onClose }: InitializeNodeModalProps) {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [school, setSchool] = useState<string>("");
  const [hostel, setHostel] = useState<string>("");
  
  const [offerTitle, setOfferTitle] = useState<string>("");
  const [category, setCategory] = useState<"SERVICE" | "COMMODITY">("SERVICE");
  const [effort, setEffort] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [condition, setCondition] = useState<string>("GOOD");
  
  const [policyStatus, setPolicyStatus] = useState<PolicyValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (session?.user?.name && !name) setName(session.user.name);
  }, [session, name]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (offerTitle.trim().length > 3) {
        setIsValidating(true);
        const result = await validatePolicy(offerTitle);
        setPolicyStatus(result);
        setIsValidating(false);
      } else {
        setPolicyStatus(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [offerTitle]);

  const [offers, setOffers] = useState<{title: string, category: "SERVICE" | "COMMODITY", effort?: any, condition?: string, tags: string[]}[]>([]);
  const [wantInput, setWantInput] = useState<string>("");
  const [wants, setWants] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addWant = () => {
    const trimmed = wantInput.trim().toUpperCase();
    if (trimmed && !wants.includes(trimmed) && wants.length < 10) {
      setWants([...wants, trimmed]);
      setWantInput("");
    }
  };

  const removeWant = (idx: number) => {
    setWants(wants.filter((_, i) => i !== idx));
  };

  const addOffer = async () => {
    if (offerTitle) {
      if (policyStatus?.isViolating) {
        toast.error(`POLICY VIOLATION: ${policyStatus.reason}`);
        return;
      }

      setOffers([...offers, { 
        title: offerTitle.toUpperCase(), 
        category, 
        effort: category === "SERVICE" ? effort : undefined,
        condition: category === "COMMODITY" ? condition : undefined,
        tags: [] 
      }]);
      setOfferTitle("");
      setPolicyStatus(null);
    }
  };

  const removeOffer = (idx: number) => {
    setOffers(offers.filter((_, i) => i !== idx));
  };

  const handleLaunch = async () => {
    if (!session?.user?.id) {
      toast.error("Session missing. Please try signing in again.");
      return;
    }

    let finalWants = [...wants];
    if (finalWants.length === 0 && wantInput.trim()) {
      const trimmed = wantInput.trim().toUpperCase();
      if (!finalWants.includes(trimmed)) {
        finalWants.push(trimmed);
        setWants(finalWants);
        setWantInput("");
      }
    }

    if (finalWants.length === 0) {
      toast.error("Please add at least one want.");
      return;
    }

    setIsLoading(true);
    const result = ProfileSchema.safeParse({ 
      userId: session.user.id, 
      name, 
      bio, 
      school, 
      hostel, 
      offers, 
      wants: finalWants 
    });
    if (!result.success) {
      toast.error(`Validation failed: ${result.error.issues[0].message}`);
      setIsLoading(false);
      return;
    }

    try {
      await atomicSyncUser(result.data as any);
      toast.success("NODE DEPLOYED: Reciprocity Engine Initialized");
      onClose();
      window.location.reload();
    } catch (err) {
      toast.error("Deployment failed — try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-stone-50 rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-8 flex items-center justify-between border-b border-stone-200 bg-white">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-primary italic">Setup Your Scholarly Identity</h2>
                <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-[0.2em] mt-1">Network Presence Protocol v2.4</p>
              </div>
            </div>
            <button onClick={onClose} className="h-10 w-10 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 pt-6">
            <StepCard num={1} title="Identity" label="Who are you in the network?" activeStep={step} onStepClick={setStep}>
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Public Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="E.g. ARYA SHARMA" className="h-14 rounded-2xl bg-white border-stone-200" />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Research Manifesto (Bio)</Label>
                   <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What are you currently exploring?" className="rounded-2xl bg-white border-stone-200 min-h-[100px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Field / Dept</Label>
                      <Input value={school} onChange={(e) => setSchool(e.target.value)} placeholder="E.g. COMPUTER SCIENCE" className="h-14 rounded-2xl bg-white border-stone-200" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Institutional ID / Key</Label>
                      <Input value={hostel} onChange={(e) => setHostel(e.target.value)} placeholder="E.g. REG-001" className="h-14 rounded-2xl bg-white border-stone-200" />
                   </div>
                </div>
                <Button onClick={() => setStep(2)} disabled={!name || !school} className="w-full h-14 rounded-2xl btn-premium text-white font-bold uppercase text-[10px] tracking-widest">Continue</Button>
              </div>
            </StepCard>

            <StepCard num={2} title="Knowledge & Resources" label="What can you provide to others?" activeStep={step} onStepClick={setStep}>
              <div className="space-y-8 pt-4">
                 <div className="space-y-4">
                    <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">New Offering</Label>
                    <div className="flex gap-2">
                       <div className="relative flex-1">
                         <Input 
                          value={offerTitle} 
                          onChange={(e) => setOfferTitle(e.target.value)} 
                          placeholder="E.g. PYTHON TUTORING" 
                          className={`h-14 rounded-2xl bg-white transition-all ${policyStatus?.isViolating ? "border-destructive ring-1 ring-destructive/20" : "border-stone-200"}`} 
                         />
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {isValidating ? (
                              <div className="h-3 w-3 rounded-full border border-accent border-t-transparent animate-spin" />
                            ) : policyStatus ? (
                              policyStatus.isViolating ? (
                                <ShieldAlert className="h-4 w-4 text-destructive animate-pulse" />
                              ) : (
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                              )
                            ) : null}
                         </div>
                       </div>
                       <Button onClick={addOffer} size="icon" className="h-14 w-14 rounded-2xl bg-primary text-white"><CheckCircle2 className="h-5 w-5" /></Button>
                    </div>
                    {policyStatus?.isViolating && (
                      <p className="text-[10px] font-mono font-bold text-destructive uppercase tracking-tight animate-bounce">
                        Violation: {policyStatus.reason}
                      </p>
                    )}
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Category</Label>
                       <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                          <SelectTrigger className="h-14 rounded-2xl bg-white border-stone-200"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="SERVICE">SERVICE</SelectItem><SelectItem value="COMMODITY">COMMODITY</SelectItem></SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       {category === "SERVICE" ? (
                         <>
                          <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Effort Level</Label>
                          <Select value={effort} onValueChange={(val: any) => setEffort(val)}>
                             <SelectTrigger className="h-14 rounded-2xl bg-white border-stone-200"><SelectValue /></SelectTrigger>
                             <SelectContent><SelectItem value="LOW">LOW</SelectItem><SelectItem value="MEDIUM">MEDIUM</SelectItem><SelectItem value="HIGH">HIGH</SelectItem></SelectContent>
                          </Select>
                         </>
                       ) : (
                          <>
                          <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Condition</Label>
                          <Input value={condition} onChange={(e) => setCondition(e.target.value)} className="h-14 rounded-2xl bg-white border-stone-200" />
                         </>
                       )}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">Profile Listings ({offers.length})</Label>
                    <AnimatePresence>
                      {offers.map((off, i) => (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={i} className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-100 group">
                          <div className="flex items-center gap-3">
                             {off.category === "SERVICE" ? <Briefcase className="h-4 w-4 text-stone-400" /> : <Package className="h-4 w-4 text-stone-400" />}
                             <span className="text-[11px] font-extrabold text-primary uppercase">{off.title}</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeOffer(i)} className="text-stone-300 hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                 </div>
                 
                 <Button onClick={() => setStep(3)} disabled={offers.length === 0} className="w-full h-14 rounded-2xl btn-premium text-white font-bold uppercase text-[10px] tracking-widest">Continue</Button>
              </div>
            </StepCard>

            <StepCard num={3} title="Academic Needs" label="What are you currently seeking?" activeStep={step} onStepClick={setStep}>
              <div className="space-y-8 pt-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400">What do you need?</Label>
                    <div className="flex gap-2">
                       <Input value={wantInput} onChange={(e) => setWantInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addWant()} placeholder="E.g. DATA STRUCTURES HELP" className="h-14 rounded-2xl bg-white border-stone-200" />
                       <Button onClick={addWant} size="icon" className="h-14 w-14 rounded-2xl bg-primary text-white"><CheckCircle2 className="h-5 w-5" /></Button>
                    </div>
                 </div>

                 <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {wants.map((want, i) => (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} key={i}>
                          <Badge className="bg-white border-stone-200 text-primary h-10 px-4 rounded-xl flex gap-2 items-center group shadow-sm text-[10px] font-mono font-bold">
                            {want}
                            <Trash2 onClick={() => removeWant(i)} className="h-3 w-3 text-stone-300 cursor-pointer hover:text-destructive" />
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                 </div>

                 <Button 
                   onClick={handleLaunch} 
                   disabled={isLoading} 
                   className="w-full h-16 rounded-2xl btn-premium text-white font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-accent/20"
                 >
                    {isLoading ? "Synchronizing Node..." : "Activate Exchange Node"}
                 </Button>
              </div>
            </StepCard>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
