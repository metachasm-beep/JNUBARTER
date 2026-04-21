"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserActions } from "./UserActions";

export function UserRow({ user, onInspect }: { user: any, onInspect: () => void }) {
  return (
    <>
      <tr 
        className="hover:bg-stone-50/30 transition-all group cursor-pointer"
        onClick={onInspect}
      >
        <td className="px-10 py-8">
          <div className="flex items-center gap-6">
            <div className="h-14 w-14 rounded-3xl bg-stone-100 flex items-center justify-center font-black text-stone-400 text-lg shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
              {user.name?.[0] || 'U'}
            </div>
            <div>
              <p className="text-sm font-black text-primary uppercase leading-tight">{user.name}</p>
              <p className="text-[10px] font-mono text-stone-400 flex items-center gap-1.5 mt-1">
                <Mail className="h-2.5 w-2.5" /> {user.email}
              </p>
            </div>
          </div>
        </td>
        <td className="px-10 py-8">
          <Badge className={user.role === 'ADMIN' ? 'bg-primary text-white text-[10px] px-4 py-1.5 uppercase italic' : 'bg-stone-100 text-stone-400 border-none text-[10px] px-4 py-1.5 uppercase'}>
            {user.role}
          </Badge>
        </td>
        <td className="px-10 py-8">
           {user.verificationReports[0] ? (
             <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  user.verificationReports[0].status === 'VERIFIED' ? 'bg-emerald-500' : 
                  user.verificationReports[0].status === 'CHALLENGED' ? 'bg-amber-500 animate-pulse' : 
                  'bg-stone-300'
                }`} />
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-tighter">
                  {user.verificationReports[0].status}
                </span>
                {user.idCardUrl && user.verificationReports[0].status === 'PENDING_REVIEW' && (
                  <Badge className="bg-amber-500 text-white text-[8px] px-2 py-0.5 animate-pulse border-none">ID ATTACHED</Badge>
                )}
             </div>
           ) : (
             <span className="text-[10px] font-mono text-stone-300 uppercase italic">Pending Intel</span>
           )}
        </td>
        <td className="px-10 py-8">
          <div className="flex gap-8">
            <StatPill label="Nodes" val={user._count.listings} />
            <StatPill label="Flows" val={user._count.swapsInitiated + user._count.swapsReceived} />
          </div>
        </td>
        <td className="px-10 py-8 text-right" onClick={(e) => e.stopPropagation()}>
           <UserActions userId={user.id} userName={user.name || 'Unknown'} />
        </td>
      </tr>
    </>
  );
}

function StatPill({ label, val }: { label: string, val: number }) {
  return (
    <div>
      <p className="text-[10px] font-mono font-black text-stone-300 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-lg font-black text-primary tracking-tighter">{val}</p>
    </div>
  );
}
