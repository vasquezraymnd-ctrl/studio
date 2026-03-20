"use client"

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser, useAuth, useDoc, useFirestore, useCollection } from "@/firebase";
import { doc, collectionGroup, query, orderBy, limit } from "firebase/firestore";
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
  Library,
  Clock,
  ChevronRight,
  Loader2
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { useMemoFirebase } from "@/firebase/provider";
import { Skeleton } from "@/components/ui/skeleton";

function CountdownTimer() {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const targetDate = new Date('2024-08-12T00:00:00');
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    setDaysLeft(Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))));
  }, []);

  return (
    <div className="spotify-glass rounded-[2rem] p-6 flex items-center justify-between overflow-hidden relative group">
      <div className="relative z-10">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-1">Board Exam Countdown</p>
        <h4 className="text-4xl font-black tracking-tighter text-white leading-none">
          {daysLeft} <span className="text-sm uppercase tracking-widest text-muted-foreground ml-1">Days to RMT</span>
        </h4>
      </div>
      <Clock className="w-16 h-16 text-primary/10 absolute -right-2 -bottom-2 group-hover:rotate-12 transition-transform" />
    </div>
  );
}

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

  const isAdmin = useMemo(() => {
    if (isUserLoading || !user || !user.email) return false;
    return user.email.toLowerCase().includes('admin');
  }, [user, isUserLoading]);

  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(profileRef);

  const latestModulesQuery = useMemoFirebase(() => {
    if (!db || isUserLoading || !user) return null;
    return query(collectionGroup(db, "modules"), orderBy("dateAdded", "desc"), limit(5));
  }, [db, user, isUserLoading]);

  const { data: latestModules, isLoading: modulesLoading } = useCollection(latestModulesQuery);

  useEffect(() => {
    if (!isUserLoading && !user) router.push('/');
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

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

      <main className="px-6 space-y-8">
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl h-44 bg-gradient-to-br from-card to-background border border-white/5 flex items-center px-10">
          <div className="space-y-2 relative z-10">
            <p className="text-primary font-black text-[9px] uppercase tracking-[0.2em]">Next-Gen review for Next-Gen RMTs</p>
            <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">
              {displayName} RMT
            </h2>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mt-2">Active Clinical Session</p>
          </div>
          <Library className="w-32 h-32 text-primary/5 absolute -right-6 -bottom-6 rotate-12" />
        </div>

        <CountdownTimer />

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
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Latest Releases</h3>
            <Button variant="ghost" onClick={() => router.push('/library')} className="h-auto p-0 text-[9px] font-black uppercase text-primary tracking-widest hover:bg-transparent">
              View All <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {modulesLoading ? (
                [1, 2, 3].map((i) => (
                  <Skeleton key={i} className="w-64 h-32 rounded-[2rem] bg-white/5 shrink-0" />
                ))
              ) : !latestModules || latestModules.length === 0 ? (
                <div className="w-full h-32 rounded-[2rem] border-2 border-dashed border-white/10 flex items-center justify-center">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">No modules deployed yet</p>
                </div>
              ) : (
                latestModules?.map((mod) => (
                  <div 
                    key={mod.id} 
                    onClick={() => window.open(mod.url, '_blank')}
                    className="w-64 h-32 rounded-[2rem] spotify-glass p-5 shrink-0 flex flex-col justify-between cursor-pointer group active:scale-95 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-[8px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-1 rounded-md">New</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black truncate text-white">{mod.title}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold truncate">Clinical Reference</p>
                    </div>
                  </div>
                ))
              )}
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
