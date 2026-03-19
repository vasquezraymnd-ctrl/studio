"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useFirestore, useCollection, useUser, useAuth } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { BookOpen, Trophy, Play, ExternalLink, LogOut, Home, Grid, User as UserIcon } from "lucide-react";
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

  if (isUserLoading) return null;

  return (
    <div className="min-h-screen pb-24">
      <header className="px-6 pt-12 pb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight">Study Playlists</h1>
          <Button variant="ghost" size="icon" onClick={() => auth.signOut()} className="text-muted-foreground hover:text-white">
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
        <p className="text-muted-foreground font-medium">Curated materials for your RMT preparation.</p>
      </header>

      <main className="px-6 space-y-10">
        {/* Featured Hero */}
        <div className="relative group cursor-pointer overflow-hidden rounded-3xl" onClick={() => router.push('/quiz')}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/20 opacity-90 transition-opacity group-hover:opacity-100" />
          <div className="relative p-8 space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-white" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/80">Active Assessment</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white">The RMT Gauntlet</h2>
            <p className="text-white/80 font-medium max-w-xs">100 items covering Hematology, Chemistry, and Micro.</p>
            <Button className="bg-white text-primary hover:bg-white/90 rounded-full font-bold px-6">
              <Play className="mr-2 fill-primary" /> Start Now
            </Button>
          </div>
        </div>

        {/* Modules Grid */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold">New Releases</h3>
          <div className="grid grid-cols-1 gap-4">
            {modulesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl bg-white/5" />
              ))
            ) : (
              modules?.map((mod) => (
                <Card key={mod.id} className="spotify-glass border-none group transition-all hover:bg-white/5 active:scale-[0.98]">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold truncate">{mod.title}</CardTitle>
                      <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-tight">
                        {mod.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="px-6 pb-6 pt-0 justify-end">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 rounded-full" asChild>
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
      <nav className="fixed bottom-0 left-0 right-0 h-20 spotify-glass border-t-0 flex items-center justify-around px-8 z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-primary">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Home</span>
        </Button>
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-muted-foreground" onClick={() => router.push('/quiz')}>
          <Play className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Gauntlet</span>
        </Button>
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-muted-foreground">
          <Grid className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Library</span>
        </Button>
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-muted-foreground">
          <UserIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Profile</span>
        </Button>
      </nav>
    </div>
  );
}