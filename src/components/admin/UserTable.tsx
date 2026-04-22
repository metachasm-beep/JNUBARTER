"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { UserRow } from "./UserRow";
import { AdminUserDrawer } from "./AdminUserDrawer";

export function UserTable({ initialUsers }: { initialUsers: any[] }) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleInspect = (user: any) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <div className="glass-card border-stone-200 rounded-[3rem] overflow-hidden shadow-2xl shadow-stone-200/20 bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50/50">
              <th className="px-10 py-8 text-left text-[11px] font-mono font-black uppercase tracking-widest text-stone-400">Node Identity</th>
              <th className="px-10 py-8 text-left text-[11px] font-mono font-black uppercase tracking-widest text-stone-400">Privileges</th>
              <th className="px-10 py-8 text-left text-[11px] font-mono font-black uppercase tracking-widest text-stone-400">Authority Intel</th>
              <th className="px-10 py-8 text-left text-[11px] font-mono font-black uppercase tracking-widest text-stone-400">Activity</th>
              <th className="px-10 py-8 text-right text-[11px] font-mono font-black uppercase tracking-widest text-stone-400">Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {initialUsers.length > 0 ? (
              initialUsers.map((user) => (
                <UserRow 
                  key={user.id} 
                  user={user} 
                  onInspect={() => handleInspect(user)} 
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-10 py-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-stone-50 flex items-center justify-center">
                      <Search className="h-5 w-5 text-stone-300" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-primary uppercase italic">No Peers Detected</p>
                      <p className="text-[10px] font-mono text-stone-400 mt-1 uppercase tracking-widest">The registry is currently offline or empty.</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminUserDrawer 
        user={selectedUser} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </>
  );
}
