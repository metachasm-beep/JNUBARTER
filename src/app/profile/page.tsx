import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/ProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ReputationDial } from "@/components/ReputationDial";
import { ShieldCheck, GraduationCap, MapPin, Calendar, Mail, Phone, Briefcase, Package, Sparkles } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      listings: true,
      vouchesReceived: {
        include: {
          sender: true
        }
      }
    }
  });

  if (!user) {
    redirect("/");
  }

  const formatDOB = (date: Date | null) => {
    if (!date) return "Not Provided";
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-stone-50/50 pt-12 pb-32">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        
        {/* PROFILE HEADER */}
        <section className="mb-12 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-500" />
               <Avatar className="h-40 w-40 md:h-48 md:w-48 rounded-[3rem] border-4 border-white shadow-2xl relative bg-white">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="text-4xl font-black bg-stone-100 text-stone-300">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge className="bg-accent/10 text-accent font-mono text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-none">
                    Protocol Node: Active
                  </Badge>
                  {user.isVerified && (
                    <Badge className="bg-primary text-white font-mono text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-none flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> JNU Verified
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-6xl font-sans font-black uppercase tracking-tighter italic text-primary leading-[0.9]">
                  {user.name}
                </h1>
                <p className="text-stone-500 font-medium max-w-xl italic">
                   "{user.bio || "No research manifesto provided yet. The peer registry awaits your input."}"
                </p>
              </div>

              <div className="flex flex-wrap gap-4 md:gap-8">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-stone-400" />
                  <span className="text-[10px] font-mono font-bold uppercase text-stone-600 tracking-widest">
                    {user.hostel ? `${user.hostel}${user.roomNumber ? ` / Room ${user.roomNumber}` : ''}` : "Geospatial Data Pending"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-stone-400" />
                  <span className="text-[10px] font-mono font-bold uppercase text-stone-600 tracking-widest">
                    {user.school || "Faculty Registry Pending"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                   <Calendar className="h-4 w-4 text-stone-400" />
                   <span className="text-[10px] font-mono font-bold uppercase text-stone-600 tracking-widest">
                     DOB: {formatDOB(user.dob)}
                   </span>
                </div>
              </div>
            </div>

            <div className="md:block hidden">
               <ReputationDial score={user.reputation} size={150} />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: EDIT FORM */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter italic text-primary">Protocol Configuration</h2>
                <Badge variant="outline" className="font-mono text-[10px] font-bold text-stone-400 border-stone-200">EDIT_MODE_v2.0</Badge>
              </div>
              <ProfileForm user={user} />
            </section>
          </div>

          {/* RIGHT: SCHOLARLY CAPITAL & VOUCHES */}
          <div className="space-y-12">
            <section className="glass-card p-8 rounded-[2.5rem] border-stone-100 bg-white/40">
              <h3 className="text-lg font-black uppercase tracking-tighter italic text-primary mb-6">Active Scholarly Capital</h3>
              <div className="space-y-6">
                {user.listings.length > 0 ? (
                  <div className="space-y-4">
                    {user.listings.map((listing) => (
                      <div key={listing.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-100 group relative">
                        <div className="flex justify-between items-start mb-1">
                           <p className="text-[10px] font-black uppercase text-primary truncate max-w-[150px]">{listing.title}</p>
                           {listing.category === "SERVICE" ? <Briefcase className="h-3 w-3 text-accent" /> : <Package className="h-3 w-3 text-blue-500" />}
                        </div>
                        <p className="text-[9px] text-stone-600 font-mono italic">{listing.type} • {listing.status}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="h-8 w-8 text-stone-200 mx-auto mb-4" />
                    <p className="text-[10px] text-stone-500 italic uppercase font-bold tracking-widest">Registry Empty</p>
                  </div>
                )}
              </div>
            </section>

            <section className="glass-card p-8 rounded-[2.5rem] border-stone-100 bg-primary text-white shadow-2xl shadow-primary/20">
               <h3 className="text-lg font-black uppercase tracking-tighter italic mb-6">Reputation Ledger</h3>
               <div className="space-y-6">
                  {user.vouchesReceived.length > 0 ? (
                    user.vouchesReceived.slice(0, 3).map((vouch) => (
                      <div key={vouch.id} className="space-y-2 border-l border-white/20 pl-4 py-1">
                        <p className="text-xs italic opacity-80 leading-relaxed line-clamp-2 font-medium">"{vouch.content}"</p>
                        <div className="flex items-center gap-2">
                           <Avatar className="h-5 w-5">
                             <AvatarImage src={vouch.sender.image || ""} />
                             <AvatarFallback className="text-[8px] bg-white/10">{vouch.sender.name?.charAt(0)}</AvatarFallback>
                           </Avatar>
                           <span className="text-[8px] font-mono font-bold uppercase tracking-widest opacity-60">{vouch.sender.name}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] opacity-60 italic uppercase tracking-widest font-bold">No active vouches recorded in the blockchain.</p>
                  )}
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
