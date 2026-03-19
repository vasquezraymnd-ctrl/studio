
"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser, useAuth } from "@/firebase";
import { 
  BookOpen, 
  Trophy, 
  Play, 
  LogOut, 
  Home, 
  Grid, 
  User as UserIcon, 
  Zap,
  FlaskConical,
  Microscope,
  Droplets,
  Stethoscope,
  Scale
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
          <h1 className="text-3xl font-black tracking-tighter text-white">Discovery</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Med-Tech Hub</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => auth.signOut()} className="text-muted-foreground hover:text-white">
          <LogOut className="w-6 h-6" />
        </Button>
      </header>

      <main className="px-6 space-y-10">
        {/* Daily Challenge Banner */}
        <div 
          className="relative group cursor-pointer overflow-hidden rounded-[2rem] shadow-2xl transition-transform active:scale-[0.98] h-48"
          onClick={() => router.push('/quiz/daily-challenge')}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-cyan-900 opacity-90" />
          <div className="relative p-8 flex flex-col justify-center h-full space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-white" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/80">Daily Gauntlet</span>
            </div>
            <h2 className="text-3xl font-black text-white leading-none tracking-tighter">BOARD EXAM CHALLENGE</h2>
            <p className="text-white/80 font-bold text-xs">10 high-yield items. New every 24h.</p>
          </div>
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

        {/* Recently Viewed (Horizontal) */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Recently Released</h3>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-64 h-32 rounded-[1.5rem] spotify-glass p-5 shrink-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <span className="text-[8px] font-black uppercase text-primary/50">Module</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white truncate">Metabolic Disorders {i}</h4>
                    <p className="text-[10px] text-muted-foreground font-bold">Clinical Chemistry</p>
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
