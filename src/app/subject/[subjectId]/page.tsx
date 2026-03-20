"use client"

export const runtime = 'edge';

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, Trophy, Play, ChevronLeft, ExternalLink, Clock, Trash2, Eye, EyeOff } from "lucide-react";
import { useMemoFirebase } from "@/firebase/provider";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function SubjectHub() {
  const { subjectId } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const isAdmin = useMemo(() => {
    if (isUserLoading || !user || !user.email) return false;
    return user.email.toLowerCase().includes('admin');
  }, [user, isUserLoading]);
  
  const modulesQuery = useMemoFirebase(() => {
    if (!db || !subjectId) return null;
    return query(collection(db, "subjects", subjectId as string, "modules"), orderBy("dateAdded", "desc"));
  }, [db, subjectId]);

  const assessmentsQuery = useMemoFirebase(() => {
    if (!db || !subjectId) return null;
    return query(collection(db, "subjects", subjectId as string, "assessments"), orderBy("title", "asc"));
  }, [db, subjectId]);

  const { data: rawModules, isLoading: modulesLoading } = useCollection(modulesQuery);
  const { data: rawAssessments, isLoading: assessmentsLoading } = useCollection(assessmentsQuery);

  const now = new Date();

  const modules = useMemo(() => {
    if (!rawModules) return null;
    return rawModules.filter(m => isAdmin || !m.visibleAt || new Date(m.visibleAt) <= now);
  }, [rawModules, now, isAdmin]);

  const assessments = useMemo(() => {
    if (!rawAssessments) return null;
    return rawAssessments.filter(a => isAdmin || !a.visibleAt || new Date(a.visibleAt) <= now);
  }, [rawAssessments, now, isAdmin]);

  const subjectName = useMemo(() => {
    if (!subjectId) return "Loading...";
    return (subjectId as string).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }, [subjectId]);

  const handleDelete = (type: 'modules' | 'assessments', id: string) => {
    if (!db || !subjectId || !isAdmin) return;
    const docRef = doc(db, "subjects", subjectId as string, type, id);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Item Deleted", description: "Resource has been removed from the platform." });
  };

  const toggleVisibility = (type: 'modules' | 'assessments', id: string, currentlyHidden: boolean) => {
    if (!db || !subjectId || !isAdmin) return;
    const docRef = doc(db, "subjects", subjectId as string, type, id);
    const newDate = currentlyHidden ? new Date().toISOString() : new Date('2099-01-01').toISOString();
    updateDocumentNonBlocking(docRef, { visibleAt: newDate });
    toast({ title: currentlyHidden ? "Item Visible" : "Item Hidden", description: "Visibility status updated." });
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      <header className="px-6 pt-12 pb-8 space-y-4">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="p-0 text-muted-foreground hover:text-white">
          <ChevronLeft className="w-6 h-6 mr-1" /> Back
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase">{subjectName}</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Subject Library</p>
          </div>
        </div>
      </header>

      <main className="px-6">
        <Tabs defaultValue="library" className="space-y-8">
          <TabsList className="w-full h-14 bg-white/5 rounded-full p-1 border border-white/5">
            <TabsTrigger value="library" className="flex-1 rounded-full text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Study Library
            </TabsTrigger>
            <TabsTrigger value="bank" className="flex-1 rounded-full text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Test Bank
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4 mt-0 animate-in fade-in duration-500">
            {modulesLoading ? (
              <SkeletonList />
            ) : modules?.length === 0 ? (
              <EmptyState icon={BookOpen} label="No materials released yet." />
            ) : (
              modules?.map((mod) => {
                const isHidden = mod.visibleAt && new Date(mod.visibleAt) > now;
                return (
                  <div key={mod.id} className={cn("spotify-glass rounded-[2rem] p-6 flex items-center gap-6 group transition-opacity", isHidden && "opacity-60")}>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-white text-lg truncate">{mod.title}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold truncate">{mod.description || 'Standard Review Module'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => toggleVisibility('modules', mod.id, isHidden)} className="text-muted-foreground hover:text-primary">
                            {isHidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete('modules', mod.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" className="text-primary" asChild>
                        <a href={mod.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-6 h-6" />
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="bank" className="space-y-4 mt-0 animate-in fade-in duration-500">
            {assessmentsLoading ? (
              <SkeletonList />
            ) : assessments?.length === 0 ? (
              <EmptyState icon={Trophy} label="No assessments available." />
            ) : (
              assessments?.map((test) => {
                const isHidden = test.visibleAt && new Date(test.visibleAt) > now;
                return (
                  <div 
                    key={test.id} 
                    className={cn("spotify-glass rounded-[2.5rem] p-8 flex items-center justify-between group transition-all", isHidden && "opacity-60")}
                  >
                    <div className="space-y-2 flex-1 min-w-0" onClick={() => router.push(`/quiz/${subjectId}/${test.id}`)}>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black uppercase tracking-widest bg-primary/20 text-primary px-2 py-1 rounded-md">{test.difficulty || 'Board Standard'}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 60 MIN
                        </span>
                      </div>
                      <h4 className="font-black text-white text-2xl tracking-tighter leading-none truncate pr-10 uppercase">{test.title}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{test.totalItems} Items • Practice Bank</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {isAdmin && (
                        <div className="flex flex-col gap-2">
                          <Button variant="ghost" size="icon" onClick={() => toggleVisibility('assessments', test.id, isHidden)} className="text-muted-foreground hover:text-primary">
                            {isHidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete('assessments', test.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      )}
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform cursor-pointer" onClick={() => router.push(`/quiz/${subjectId}/${test.id}`)}>
                        <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function SkeletonList() {
  return Array.from({ length: 3 }).map((_, i) => (
    <Skeleton key={i} className="h-28 w-full rounded-[2rem] bg-white/5" />
  ));
}

function EmptyState({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
      <Icon className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
      <p className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">{label}</p>
    </div>
  );
}