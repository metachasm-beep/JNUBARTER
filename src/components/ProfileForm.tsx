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
    <form onSubmit={handleSubmit} className="space-y-8">
      <SpotlightCard className="p-8 rounded-[2.5rem] border-stone-100 bg-white/50 space-y-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter italic text-primary">Identity Parameters</h3>
            <p className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">Personal Identification Ledger</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">Full Name</Label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              className="h-14 rounded-2xl bg-white border-stone-200" 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">Gender</Label>
            <Select 
              value={formData.gender} 
              onValueChange={(val) => setFormData({ ...formData, gender: val })}
            >
              <SelectTrigger className="h-14 rounded-2xl bg-white border-stone-200">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">MALE</SelectItem>
                <SelectItem value="FEMALE">FEMALE</SelectItem>
                <SelectItem value="NON-BINARY">NON-BINARY</SelectItem>
                <SelectItem value="OTHER">OTHER</SelectItem>
                <SelectItem value="PREFER NOT TO SAY">PREFER NOT TO SAY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">Date of Birth</Label>
            <div className="relative">
              <Input 
                type="date"
                value={formData.dob} 
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })} 
                className="h-14 rounded-2xl bg-white border-stone-200 pl-12" 
              />
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">Contact Number</Label>
            <div className="relative">
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                placeholder="+91 XXXXX XXXXX"
                className="h-14 rounded-2xl bg-white border-stone-200 pl-12" 
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">Scholarly Manifesto (Bio)</Label>
          <Textarea 
            value={formData.bio} 
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
            placeholder="Introduce your scholarly background..."
            className="rounded-2xl bg-white border-stone-200 min-h-[120px] pt-4" 
          />
        </div>
      </SpotlightCard>

      <SpotlightCard className="p-8 rounded-[2.5rem] border-stone-100 bg-white/50 space-y-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <School className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter italic text-primary">Academic Node</h3>
            <p className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">Institutional Residency Parameters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">School / Center</Label>
            <Select 
              value={formData.school} 
              onValueChange={(val) => setFormData({ ...formData, school: val })}
            >
              <SelectTrigger className="h-14 rounded-2xl bg-white border-stone-200">
                <SelectValue placeholder="Select School" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SIS">SIS (School of International Studies)</SelectItem>
                <SelectItem value="SLLCS">SLL&CS (School of Language, Literature & Culture Studies)</SelectItem>
                <SelectItem value="SSS">SSS (School of Social Sciences)</SelectItem>
                <SelectItem value="SPS">SPS (School of Physical Sciences)</SelectItem>
                <SelectItem value="SLS">SLS (School of Life Sciences)</SelectItem>
                <SelectItem value="SCSS">SCSS (School of Computer & Systems Sciences)</SelectItem>
                <SelectItem value="SE">SE (School of Engineering)</SelectItem>
                <SelectItem value="Sanskrit">School of Sanskrit & Indic Studies</SelectItem>
                <SelectItem value="ABVSME">ABV School of Management & Entrepreneurship</SelectItem>
                <SelectItem value="OTHER">OTHER</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">Program of Study</Label>
            <Input 
              value={formData.program} 
              onChange={(e) => setFormData({ ...formData, program: e.target.value })} 
              placeholder="E.g. PhD, MA, BA"
              className="h-14 rounded-2xl bg-white border-stone-200" 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">Year</Label>
            <Input 
              value={formData.year} 
              onChange={(e) => setFormData({ ...formData, year: e.target.value })} 
              placeholder="E.g. 1st Year, Final Year"
              className="h-14 rounded-2xl bg-white border-stone-200" 
            />
          </div>
        </div>
      </SpotlightCard>

      <SpotlightCard className="p-8 rounded-[2.5rem] border-stone-100 bg-white/50 space-y-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter italic text-primary">Campus Residence</h3>
            <p className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">Geospatial Registry Data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">Hostel Name</Label>
            <Select 
              value={formData.hostel} 
              onValueChange={(val) => setFormData({ ...formData, hostel: val })}
            >
              <SelectTrigger className="h-14 rounded-2xl bg-white border-stone-200">
                <SelectValue placeholder="Select Hostel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tapti">Tapti</SelectItem>
                <SelectItem value="Mahi-Mandavi">Mahi-Mandavi</SelectItem>
                <SelectItem value="Koyna">Koyna</SelectItem>
                <SelectItem value="Shipra">Shipra</SelectItem>
                <SelectItem value="Jhelum">Jhelum</SelectItem>
                <SelectItem value="Sutlej">Sutlej</SelectItem>
                <SelectItem value="Ganga">Ganga</SelectItem>
                <SelectItem value="Yamuna">Yamuna</SelectItem>
                <SelectItem value="Sabarmati">Sabarmati</SelectItem>
                <SelectItem value="Narmada">Narmada</SelectItem>
                <SelectItem value="Periyar">Periyar</SelectItem>
                <SelectItem value="Kavery">Kavery</SelectItem>
                <SelectItem value="Brahmaputra">Brahmaputra</SelectItem>
                <SelectItem value="Lohit">Lohit</SelectItem>
                <SelectItem value="Chandrabhaga">Chandrabhaga</SelectItem>
                <SelectItem value="Damodar">Damodar</SelectItem>
                <SelectItem value="Day-Scholar">Day Scholar (Off-Campus)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">Room Number</Label>
            <Input 
              value={formData.roomNumber} 
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })} 
              placeholder="E.g. 242"
              className="h-14 rounded-2xl bg-white border-stone-200" 
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
