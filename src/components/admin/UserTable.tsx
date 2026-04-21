"use client";

import { useState } from "react";
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
            {initialUsers.map((user) => (
              <UserRow 
                key={user.id} 
                user={user} 
                onInspect={() => handleInspect(user)} 
              />
            ))}
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
