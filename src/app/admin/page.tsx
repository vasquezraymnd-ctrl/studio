"use client"

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, doc, collectionGroup, query, orderBy, limit } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ChevronLeft, 
  Database, 
  PlusCircle, 
  Lock, 
  Loader2, 
  CalendarClock,
  Users,
  Trophy,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { addDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useMemoFirebase } from "@/firebase/provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

export default function AdminPortal() {
  const router = useRouter();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [mode, setMode] = useState<'module' | 'quiz' | 'progress'>('module');
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [visibleAt, setVisibleAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REDUNDANT GUARD: Ensure isAdmin is only true when user and email are definitively loaded
  const isAdmin = useMemo(() => {
    if (isUserLoading) return false;
    if (!user || !user.email) return false;
    return user.email.toLowerCase().includes('admin');
  }, [user, isUserLoading]);

  // Global Progress Monitoring - ONLY query if we are certain of admin status
  const allProgressQuery = useMemoFirebase(() => {
    // CRITICAL: prevents unauthorized list attempt at root path
    if (!db || isUserLoading || !user || !isAdmin) return null;
    return query(collectionGroup(db, "progress"), orderBy("completedAt", "desc"), limit(50));
  }, [db, isAdmin, isUserLoading, user]);

  const { data: globalProgress, isLoading: progressLoading } = useCollection(allProgressQuery);

  useEffect(() => {
    if (!isUserLoading && (!user || !isAdmin)) {
      router.push('/dashboard');
    }
  }, [isAdmin, isUserLoading, router, user]);

  const handleModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !db || !isAdmin) return;
    setIsSubmitting(true);
    
    const colRef = collection(db, "subjects", subject, "modules");
    const data = {
      title,
      description,
      url,
      dateAdded: new Date().toISOString(),
      visibleAt: visibleAt ? new Date(visibleAt).toISOString() : new Date().toISOString()
    };

    addDocumentNonBlocking(colRef, data)
      .then(() => {
        toast({ title: "Module Deployed", description: "The study material has been scheduled." });
        setTitle(""); setDescription(""); setUrl(""); setVisibleAt("");
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !jsonInput || !db || !isAdmin) return;
    setIsSubmitting(true);
    
    try {
      const parsed = JSON.parse(jsonInput);
      const assessmentRef = doc(collection(db, "subjects", subject, "assessments"));
      
      const data = {
        ...parsed,
        id: assessmentRef.id,
        totalItems: parsed.questions?.length || 0,
        visibleAt: visibleAt ? new Date(visibleAt).toISOString() : new Date().toISOString()
      };

      setDocumentNonBlocking(assessmentRef, data, { merge: true });
      
      toast({ title: "Quiz Scheduled", description: "Test bank has been queued for sync." });
      setJsonInput(""); setVisibleAt("");
    } catch (e: any) {
      toast({ variant: "destructive", title: "JSON Syntax Error", description: "Please verify the question object structure." });
    }
    setIsSubmitting(false);
  };

  if (isUserLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-8 text-center space-y-6">
        <Lock className="w-20 h-20 text-destructive/50" />
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Access Denied</h2>
        <p className="text-muted-foreground text-sm font-bold">Only administrators can access the Command Center.</p>
        <Button onClick={() => router.push('/dashboard')} className="rounded-full px-10 h-14 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest">Return Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-6 pt-12 pb-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="p-0 text-muted-foreground hover:text-white">
          <ChevronLeft className="w-6 h-6 mr-1" /> Dashboard
        </Button>
        <div className="text-right">
          <h1 className="text-2xl font-black text-white tracking-tighter">COMMAND CENTER</h1>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Vetted Deployment pipeline</p>
        </div>
      </header>

      <main className="px-6 max-w-4xl mx-auto space-y-10 pb-20">
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => setMode('module')} 
            className={cn("flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all", mode === 'module' ? "bg-primary text-primary-foreground shadow-lg" : "spotify-glass border-none text-white/50")}
          >
            <PlusCircle className="mr-2 w-4 h-4" /> Add Module
          </Button>
          <Button 
            onClick={() => setMode('quiz')} 
            className={cn("flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all", mode === 'quiz' ? "bg-primary text-primary-foreground shadow-lg" : "spotify-glass border-none text-white/50")}
          >
            <Database className="mr-2 w-4 h-4" /> Bulk Upload
          </Button>
          <Button 
            onClick={() => setMode('progress')} 
            className={cn("flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all", mode === 'progress' ? "bg-primary text-primary-foreground shadow-lg" : "spotify-glass border-none text-white/50")}
          >
            <Users className="mr-2 w-4 h-4" /> Student Progress
          </Button>
        </div>

        {mode !== 'progress' ? (
          <div className="spotify-glass rounded-[3rem] p-10 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Target Subject</label>
                <Select onValueChange={setSubject} value={subject}>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl">
                    <SelectValue placeholder="Select Subject..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="clinical-chemistry">Clinical Chemistry</SelectItem>
                    <SelectItem value="microbiology">Microbiology</SelectItem>
                    <SelectItem value="hematology">Hematology</SelectItem>
                    <SelectItem value="blood-banking">Blood Banking</SelectItem>
                    <SelectItem value="clinical-microscopy">Clinical Microscopy</SelectItem>
                    <SelectItem value="mt-laws">MT Laws</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2">
                  <CalendarClock className="w-3 h-3 text-primary" /> Visibility Schedule (Optional)
                </label>
                <input 
                  type="datetime-local" 
                  value={visibleAt} 
                  onChange={e => setVisibleAt(e.target.value)} 
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white focus:outline-none focus:border-primary" 
                />
              </div>
            </div>

            {mode === 'module' && (
              <form onSubmit={handleModuleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Module Title</label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., CBC & Morphology" className="h-14 bg-white/5 border-white/10 rounded-2xl" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Resource Link</label>
                  <Input value={url} onChange={e => setUrl(e.target.value)} required placeholder="Direct URL" className="h-14 bg-white/5 border-white/10 rounded-2xl" />
                </div>
                <Button type="submit" disabled={isSubmitting || !subject} className="w-full h-16 bg-primary text-primary-foreground font-black rounded-full text-lg shadow-2xl transition-all active:scale-95">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Deploy Module"}
                </Button>
              </form>
            )}

            {mode === 'quiz' && (
              <form onSubmit={handleQuizSubmit} className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">JSON Payload (Manual Upload)</label>
                  <Textarea 
                    value={jsonInput} 
                    onChange={e => setJsonInput(e.target.value)} 
                    required 
                    placeholder='{ "title": "Hematology Quiz", "questions": [...] }'
                    className="min-h-[300px] bg-white/5 border-white/10 rounded-3xl p-6 font-mono text-xs"
                  />
                </div>
                <Button type="submit" disabled={isSubmitting || !subject || !jsonInput} className="w-full h-16 bg-primary text-primary-foreground font-black rounded-full text-lg shadow-2xl transition-all active:scale-95">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Flash to Test Bank"}
                </Button>
              </form>
            )}
          </div>
        ) : (
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Global Student Performance</h3>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{globalProgress?.length || 0} Recent Sessions</span>
            </div>

            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {progressLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-28 w-full rounded-[2rem] bg-white/5 animate-pulse" />
                  ))
                ) : !globalProgress || globalProgress.length === 0 ? (
                  <div className="text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
                    <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                    <p className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">No student data recorded yet.</p>
                  </div>
                ) : (
                  globalProgress?.map((item) => (
                    <div key={item.id} className="spotify-glass rounded-[2rem] p-6 space-y-4 group transition-colors hover:bg-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-black text-white text-lg tracking-tighter uppercase leading-none truncate">
                              {item.userEmail?.split('@')[0]}
                            </h4>
                            <p className="text-[9px] font-black uppercase text-primary tracking-widest mt-1">
                              {item.assessmentTitle}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-primary leading-none">{item.score}</span>
                          <span className="text-xs font-black text-muted-foreground uppercase ml-1">/ {item.total}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[8px] font-black uppercase text-muted-foreground tracking-widest">
                          <span>Success Rate</span>
                          <span>{item.total > 0 ? Math.round((item.score / item.total) * 100) : 0}%</span>
                        </div>
                        <Progress value={item.total > 0 ? (item.score / item.total) * 100 : 0} className="h-1.5 bg-white/5" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </section>
        )}
      </main>
    </div>
  );
}