"use client"

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collectionGroup, query, orderBy } from "firebase/firestore";
import { 
  ChevronLeft, 
  Library as LibraryIcon, 
  BookOpen, 
  ExternalLink,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMemoFirebase } from "@/firebase/provider";
import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalLibrary() {
  const router = useRouter();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");

  const allModulesQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collectionGroup(db, "modules"), orderBy("dateAdded", "desc"));
  }, [db, user]);

  const { data: rawModules, isLoading } = useCollection(allModulesQuery);

  const now = new Date();

  const filteredModules = useMemo(() => {
    if (!rawModules) return [];
    return rawModules
      .filter(m => !m.visibleAt || new Date(m.visibleAt) <= now)
      .filter(mod => 
        mod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mod.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [rawModules, searchTerm, now]);

  useEffect(() => {
    if (!isUserLoading && !user) router.push('/');
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) return null;

  return (
    <div className="min-h-screen pb-32 bg-background font-body">
      <header className="px-6 pt-12 pb-8 space-y-6 sticky top-0 bg-background/95 backdrop-blur-xl z-50">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push('/dashboard')} className="p-0 text-muted-foreground hover:text-white">
            <ChevronLeft className="w-6 h-6 mr-1" /> Back
          </Button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-white tracking-tighter">YOUR LIBRARY</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">All Study Materials</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search titles or keywords..." 
            className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:border-primary/50 transition-all text-sm"
          />
        </div>
      </header>

      <main className="px-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
            <Filter className="w-3 h-3" /> Latest Releases
          </h3>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
            {filteredModules?.length || 0} Items
          </span>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-[2rem] bg-white/5" />
            ))
          ) : filteredModules?.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
              <LibraryIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">No matching materials found.</p>
            </div>
          ) : (
            filteredModules?.map((mod) => (
              <div key={mod.id} className="spotify-glass rounded-[2rem] p-6 flex items-center gap-6 group hover:bg-white/5 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-white text-lg truncate">{mod.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-bold truncate">{mod.description || 'Standard Review Module'}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/20 rounded-xl" asChild>
                  <a href={mod.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </Button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}