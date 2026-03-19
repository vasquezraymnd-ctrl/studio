
"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser, useAuth, useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
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
  HeartPulse,
  TestTube2,
  Gavel,
  Library
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { useMemoFirebase } from "@/firebase/provider";

const SUBJECTS = [
  { id: 'clinical-chemistry', name: 'Clinical Chemistry', icon: FlaskConical, color: 'from-blue-600' },
  { id: 'microbiology', name: 'Microbiology & Parasitology', icon: Microscope, color: 'from-green-600' },
  { id: 'hematology', name: 'Hematology', icon: Droplets, color: 'from-red-600' },
  { id: 'blood-banking', name: 'Blood Banking & Serology', icon: HeartPulse, color: 'from-purple-600' },
  { id: 'clinical-microscopy', name: 'Clinical Microscopy', icon: TestTube2, color: 'from-cyan-600' },
  { id: 'mt-laws', name: 'MT Laws & Histopath', icon: Gavel, color: 'from-amber-600' },
];

export default function DiscoveryDashboard() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();

  const isAdmin = user?.email?.toLowerCase().includes('admin');

  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(profileRef);

  useEffect(() => {
    if (!isUserLoading && !user) router.push('/');
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) return null;

  const displayName = profile?.displayName || user.email?.split('@')[0].toUpperCase();

  return (
    <div className="min-h-screen pb-32 bg-transparent font-body">
      <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Synapse</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => auth.signOut()} className="text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <main className="px-6 space-y-10">
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl h-44 bg-gradient-to-br from-card to-background border border-white/5 flex items-center px-10">
          <div className="space-y-2 relative z-10">
            <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em]">Good day!</p>
            <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">
              {displayName} RMT
            </h2>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mt-2">Select a subject to begin your session</p>
          </div>
          <Library className="w-32 h-32 text-primary/5 absolute -right-6 -bottom-6 rotate-12" />
        </div>

        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">The 6 Subjects</h3>
          <div className="grid grid-cols-2 gap-4">
            {SUBJECTS.map((sub) => (
              <button 
                key={sub.id}
                onClick={() => router.push(`/subject/${sub.id}`)}
                className={`relative aspect-square rounded-[2.5rem] p-6 text-left overflow-hidden bg-gradient-to-br ${sub.color} to-card group transition-all active:scale-95 shadow-xl border border-white/5`}
              >
                <sub.icon className="w-20 h-20 text-white/10 absolute -right-4 -bottom-4 group-hover:scale-125 transition-transform" />
                <sub.icon className="w-14 h-14 text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                <span className="text-lg font-black text-white leading-tight block drop-shadow-md">{sub.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Latest Releases</h3>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-64 h-32 rounded-[2rem] spotify-glass p-5 shrink-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <BookOpen className="w-6 h-6 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
                    <span className="text-[8px] font-black uppercase text-primary/50 tracking-widest">Board Ready</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black truncate">Review Module {i}</h4>
                    <p className="text-[10px] text-muted-foreground font-bold">Standard Reference</p>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-card/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-8 z-50 rounded-t-[3rem] shadow-2xl">
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-primary hover:bg-transparent" onClick={() => router.push('/dashboard')}>
          <Home className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </Button>
        {isAdmin && (
          <Button variant="ghost" className="flex flex-col gap-1 items-center text-muted-foreground hover:text-primary" onClick={() => router.push('/admin')}>
            <Zap className="w-7 h-7" />
            <span className="text-[9px] font-black uppercase tracking-widest">Admin</span>
          </Button>
        )}
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-muted-foreground hover:text-primary" onClick={() => router.push('/library')}>
          <Grid className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Library</span>
        </Button>
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-muted-foreground hover:text-primary" onClick={() => router.push('/profile')}>
          <UserIcon className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
        </Button>
      </nav>
    </div>
  );
}
