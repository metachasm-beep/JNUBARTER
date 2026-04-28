"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Save, User as UserIcon, Calendar, Home, Phone, GraduationCap, School } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

interface ProfileFormProps {
  user: any;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    school: user.school || "",
    hostel: user.hostel || "",
    roomNumber: user.roomNumber || "",
    program: user.program || "",
    year: user.year || "",
    dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
    gender: user.gender || "",
    phone: user.phone || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      toast.success("Profile ledger updated successfully.");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to sync profile data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <SpotlightCard className="p-10 rounded-[3rem] border-stone-200/50 bg-white/70 backdrop-blur-xl shadow-xl space-y-10">
        <div className="flex items-center gap-6 mb-2">
          <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/10">
            <UserIcon className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic text-primary">Identity Parameters</h3>
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-accent rounded-full" />
              <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">Protocol Identification Ledger</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 ml-1">Legal Full Name</Label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              className="h-16 rounded-2xl bg-stone-50/50 border-stone-200 focus:bg-white transition-all text-sm font-bold uppercase tracking-tight" 
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 ml-1">Gender Identification</Label>
            <Select 
              value={formData.gender} 
              onValueChange={(val) => setFormData({ ...formData, gender: val })}
            >
              <SelectTrigger className="h-16 rounded-2xl bg-stone-50/50 border-stone-200 focus:bg-white transition-all text-sm font-bold uppercase tracking-tight">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-stone-200 shadow-2xl">
                <SelectItem value="MALE">MALE</SelectItem>
                <SelectItem value="FEMALE">FEMALE</SelectItem>
                <SelectItem value="NON-BINARY">NON-BINARY</SelectItem>
                <SelectItem value="OTHER">OTHER</SelectItem>
                <SelectItem value="PREFER NOT TO SAY">PREFER NOT TO SAY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 ml-1">Temporal Origin (DOB)</Label>
            <div className="relative group">
              <Input 
                type="date"
                value={formData.dob} 
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })} 
                className="h-16 rounded-2xl bg-stone-50/50 border-stone-200 pl-14 focus:bg-white transition-all text-sm font-bold uppercase tracking-tight" 
              />
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-accent transition-colors" />
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 ml-1">Secure Contact Line</Label>
            <div className="relative group">
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                placeholder="+91 XXXXX XXXXX"
                className="h-16 rounded-2xl bg-stone-50/50 border-stone-200 pl-14 focus:bg-white transition-all text-sm font-bold uppercase tracking-tight" 
              />
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-accent transition-colors" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 ml-1">Scholarly Manifesto</Label>
          <Textarea 
            value={formData.bio} 
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
            placeholder="Introduce your scholarly background and research interests..."
            className="rounded-3xl bg-stone-50/50 border-stone-200 min-h-[160px] pt-6 px-6 focus:bg-white transition-all text-sm font-medium leading-relaxed italic" 
          />
        </div>
      </SpotlightCard>

      <SpotlightCard className="p-10 rounded-[3rem] border-stone-200/50 bg-white/70 backdrop-blur-xl shadow-xl space-y-10">
        <div className="flex items-center gap-6 mb-2">
          <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/10">
            <School className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic text-primary">Academic Node</h3>
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-blue-400 rounded-full" />
              <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">Institutional Registry Parameters</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 ml-1">Institutional Faculty</Label>
            <Select 
              value={formData.school} 
              onValueChange={(val) => setFormData({ ...formData, school: val })}
            >
              <SelectTrigger className="h-16 rounded-2xl bg-stone-50/50 border-stone-200 focus:bg-white transition-all text-sm font-bold uppercase tracking-tight">
                <SelectValue placeholder="Select School" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-stone-200 shadow-2xl">
                <SelectItem value="SIS">SIS (International Studies)</SelectItem>
                <SelectItem value="SLLCS">SLL&CS (Languages & Culture)</SelectItem>
                <SelectItem value="SSS">SSS (Social Sciences)</SelectItem>
                <SelectItem value="SPS">SPS (Physical Sciences)</SelectItem>
                <SelectItem value="SLS">SLS (Life Sciences)</SelectItem>
                <SelectItem value="SCSS">SCSS (Computer Sciences)</SelectItem>
                <SelectItem value="SE">SE (Engineering)</SelectItem>
                <SelectItem value="Sanskrit">Sanskrit & Indic Studies</SelectItem>
                <SelectItem value="ABVSME">ABV Management & Ent.</SelectItem>
                <SelectItem value="OTHER">OTHER INSTITUTION</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 ml-1">Program of Study</Label>
            <Input 
              value={formData.program} 
              onChange={(e) => setFormData({ ...formData, program: e.target.value })} 
              placeholder="E.g. PhD, MA, BA"
              className="h-16 rounded-2xl bg-stone-50/50 border-stone-200 focus:bg-white transition-all text-sm font-bold uppercase tracking-tight" 
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 ml-1">Scholarly Seniority (Year)</Label>
            <Input 
              value={formData.year} 
              onChange={(e) => setFormData({ ...formData, year: e.target.value })} 
              placeholder="E.g. 1st Year, Final Year"
              className="h-16 rounded-2xl bg-stone-50/50 border-stone-200 focus:bg-white transition-all text-sm font-bold uppercase tracking-tight" 
            />
          </div>
        </div>
      </SpotlightCard>

      <SpotlightCard className="p-10 rounded-[3rem] border-stone-200/50 bg-white/70 backdrop-blur-xl shadow-xl space-y-10">
        <div className="flex items-center gap-6 mb-2">
          <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/10">
            <Home className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic text-primary">Campus Residence</h3>
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-emerald-400 rounded-full" />
              <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">Geospatial Registry Data</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 ml-1">Hostel Allocation</Label>
            <Select 
              value={formData.hostel} 
              onValueChange={(val) => setFormData({ ...formData, hostel: val })}
            >
              <SelectTrigger className="h-16 rounded-2xl bg-stone-50/50 border-stone-200 focus:bg-white transition-all text-sm font-bold uppercase tracking-tight">
                <SelectValue placeholder="Select Hostel" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-stone-200 shadow-2xl">
                <SelectItem value="Tapti">TAPTI</SelectItem>
                <SelectItem value="Mahi-Mandavi">MAHI-MANDAVI</SelectItem>
                <SelectItem value="Koyna">KOYNA</SelectItem>
                <SelectItem value="Shipra">SHIPRA</SelectItem>
                <SelectItem value="Jhelum">JHELUM</SelectItem>
                <SelectItem value="Sutlej">SUTLEJ</SelectItem>
                <SelectItem value="Ganga">GANGA</SelectItem>
                <SelectItem value="Yamuna">YAMUNA</SelectItem>
                <SelectItem value="Sabarmati">SABARMATI</SelectItem>
                <SelectItem value="Narmada">NARMADA</SelectItem>
                <SelectItem value="Periyar">PERIYAR</SelectItem>
                <SelectItem value="Kavery">KAVERY</SelectItem>
                <SelectItem value="Brahmaputra">BRAHMAPUTRA</SelectItem>
                <SelectItem value="Lohit">LOHIT</SelectItem>
                <SelectItem value="Chandrabhaga">CHANDRABHAGA</SelectItem>
                <SelectItem value="Damodar">DAMODAR</SelectItem>
                <SelectItem value="Day-Scholar">OFF-CAMPUS SCHOLAR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 ml-1">Unit Designation (Room)</Label>
            <Input 
              value={formData.roomNumber} 
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })} 
              placeholder="E.g. 242"
              className="h-16 rounded-2xl bg-stone-50/50 border-stone-200 focus:bg-white transition-all text-sm font-bold uppercase tracking-tight" 
            />
          </div>
        </div>
      </SpotlightCard>

      <div className="flex justify-end pt-6">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="h-16 px-12 rounded-[2rem] bg-primary text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 flex items-center gap-3 transition-transform active:scale-[0.98]"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Synchronize Profile Ledger
        </Button>
      </div>
    </form>
  );
}
