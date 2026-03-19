
"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser, useAuth } from "@/firebase";
import { 
  BookOpen, 
  LogOut, 
  Home, 
  Grid, 
  User as UserIcon, 
  Zap,
  FlaskConical,
  Microscope,
  Droplets,
  Stethoscope,
  Scale,
  Library
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const SUBJECTS = [
  { id: 'clinical-chemistry', name: 'Clinical Chemistry', icon: FlaskConical, color: 'from-blue-600' },
  { id: 'microbiology', name: 'Microbiology & Parasitology', icon: Microscope, color: 'from-green-600' },
  { id: 'hematology', name: 'Hematology', icon: Droplets, color: 'from-red-600' },
  { id: 'blood-banking', name: 'Blood Banking & Serology', icon: Zap, color: 'from-purple-600' },
  { id: 'clinical-microscopy', name: 'Clinical Microscopy', icon: Stethoscope, color: 'from-cyan-600' },
  { id: 'mt-laws', name: 'MT Laws & Histopath', icon: Scale, color: 'from-amber-600' },
];

export default function DiscoveryDashboard() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) router.push('/');
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) return null;

  return (
    <div className="min-h-screen pb-32 bg-background font-body">
      <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">Review Center</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Student Portal</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => auth.signOut()} className="text-muted-foreground hover:text-white">
          <LogOut className="w-6 h-6" />
        </Button>
      </header>

      <main className="px-6 space-y-10">
        {/* Simple Welcome Banner */}
        <div className="relative overflow-hidden rounded-[2rem] shadow-2xl h-40 bg-gradient-to-r from-[#1A365D] to-[#0B1F3C] border border-white/5 flex items-center px-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Welcome back, {user.email?.split('@')[0]}</h2>
            <p className="text-white/60 font-bold text-xs uppercase tracking-widest">Select a subject to begin your session</p>
          </div>
          <Library className="w-24 h-24 text-white/5 absolute -right-4 -bottom-4 rotate-12" />
        </div>

        {/* Subjects Grid */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">The 6 Pillars</h3>
          <div className="grid grid-cols-2 gap-4">
            {SUBJECTS.map((sub) => (
              <button 
                key={sub.id}
                onClick={() => router.push(`/subject/${sub.id}`)}
                className={`relative aspect-square rounded-[2rem] p-6 text-left overflow-hidden bg-gradient-to-br ${sub.color} to-background/50 group transition-all active:scale-95 shadow-xl`}
              >
                <sub.icon className="w-10 h-10 text-white/20 absolute -right-2 -bottom-2 group-hover:scale-125 transition-transform" />
                <sub.icon className="w-8 h-8 text-white mb-4" />
                <span className="text-lg font-black text-white leading-tight block">{sub.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recently Released (Horizontal) */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Latest Materials</h3>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-64 h-32 rounded-[1.5rem] spotify-glass p-5 shrink-0 flex flex-col justify-between border-white/5">
                  <div className="flex justify-between items-start">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <span className="text-[8px] font-black uppercase text-primary/50 tracking-widest">Resource</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white truncate">Review Module {i}</h4>
                    <p className="text-[10px] text-muted-foreground font-bold">Standard Reference</p>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </section>
      </main>

      {/* Spotify style Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-[#0B1F3C]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-8 z-50 rounded-t-[3rem] shadow-2xl">
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-primary hover:bg-transparent">
          <Home className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </Button>
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-muted-foreground hover:text-white" onClick={() => router.push('/admin')}>
          <Zap className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Admin</span>
        </Button>
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-muted-foreground hover:text-white">
          <Grid className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Library</span>
        </Button>
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-muted-foreground hover:text-white">
          <UserIcon className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
        </Button>
      </nav>
    </div>
  );
}
