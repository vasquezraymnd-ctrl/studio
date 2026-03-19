"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useFirestore, useCollection, useUser, useAuth } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { BookOpen, Trophy, Play, ExternalLink, LogOut, Home, Grid, User as UserIcon, Plus } from "lucide-react";
import { useMemoFirebase } from "@/firebase/provider";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDashboard() {
  const router = useRouter();
  const db = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const modulesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "studyModules"), orderBy("uploadDate", "desc"));
  }, [db]);

  const { data: modules, isLoading: modulesLoading } = useCollection(modulesQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) return null;

  const isAdmin = user.email?.includes('admin');

  return (
    <div className="min-h-screen pb-32 bg-background">
      <header className="px-6 pt-12 pb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Your Playlists</h1>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mt-1">Curated Study Materials</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button size="icon" variant="ghost" onClick={() => router.push('/admin')} className="text-primary hover:bg-primary/10">
              <Plus className="w-6 h-6" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => auth.signOut()} className="text-muted-foreground hover:text-white">
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <main className="px-6 space-y-12">
        {/* Featured Hero: The Gauntlet */}
        <div 
          className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] shadow-2xl transition-transform active:scale-[0.98]" 
          onClick={() => router.push('/quiz')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/40 to-transparent opacity-90" />
          <div className="relative p-10 space-y-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-white" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Premium Assessment</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-white leading-none tracking-tighter">THE GAUNTLET</h2>
              <p className="text-white/80 font-bold text-sm max-w-[240px]">100 items spanning Hematology, Micro, and Chemistry.</p>
            </div>
            <Button className="bg-white text-primary hover:bg-white/90 rounded-full font-black px-10 h-14 text-lg shadow-xl group-hover:scale-105 transition-transform">
              <Play className="mr-2 fill-primary" /> Start Session
            </Button>
          </div>
        </div>

        {/* Study Modules Grid */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Recently Released</h3>
          <div className="grid grid-cols-1 gap-4">
            {modulesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-3xl bg-white/5" />
              ))
            ) : modules?.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground font-bold text-sm">Library is empty.</p>
              </div>
            ) : (
              modules?.map((mod) => (
                <Card key={mod.id} className="spotify-glass border-none group transition-all hover:bg-white/10 active:scale-[0.98]">
                  <CardHeader className="flex flex-row items-center gap-6 space-y-0 p-6">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-primary/20 flex items-center justify-center shrink-0 shadow-inner">
                      <BookOpen className="w-10 h-10 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl font-black truncate">{mod.title}</CardTitle>
                      <CardDescription className="text-muted-foreground line-clamp-2 text-xs font-bold leading-relaxed mt-1">
                        {mod.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="px-6 pb-6 pt-0 justify-end">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 rounded-full font-black" asChild>
                      <a href={mod.downloadLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 w-4 h-4" /> View PDF
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Spotify style Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-[#0B1F3C]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-10 z-50 rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.6)]">
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-primary hover:bg-transparent">
          <Home className="w-7 h-7" />
          <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
        </Button>
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-muted-foreground hover:text-white" onClick={() => router.push('/quiz')}>
          <Play className="w-7 h-7" />
          <span className="text-[10px] font-black uppercase tracking-widest">Quiz</span>
        </Button>
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-muted-foreground hover:text-white">
          <Grid className="w-7 h-7" />
          <span className="text-[10px] font-black uppercase tracking-widest">Library</span>
        </Button>
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-muted-foreground hover:text-white">
          <UserIcon className="w-7 h-7" />
          <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
        </Button>
      </nav>
    </div>
  );
}