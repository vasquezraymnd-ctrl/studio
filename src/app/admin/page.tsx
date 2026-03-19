"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFirestore, useUser } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Database, FileJson, Link as LinkIcon, PlusCircle, ShieldAlert, Lock, Loader2, CalendarClock, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function AdminPortal() {
  const router = useRouter();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [mode, setMode] = useState<'module' | 'quiz'>('module');
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [visibleAt, setVisibleAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.email?.toLowerCase().includes('admin');

  useEffect(() => {
    if (!isUserLoading && !isAdmin && user) {
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
      <header className="px-6 pt-12 pb-8 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="p-0 text-muted-foreground hover:text-white">
          <ChevronLeft className="w-6 h-6 mr-1" /> Dashboard
        </Button>
        <div className="text-right">
          <h1 className="text-2xl font-black text-white tracking-tighter">COMMAND CENTER</h1>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Vetted Deployment pipeline</p>
        </div>
      </header>

      <main className="px-6 max-w-2xl mx-auto space-y-10 pb-20">
        <div className="flex gap-2">
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
        </div>

        <div className="spotify-glass rounded-[3rem] p-10 space-y-8">
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
            <Input 
              type="datetime-local" 
              value={visibleAt} 
              onChange={e => setVisibleAt(e.target.value)} 
              className="h-14 bg-white/5 border-white/10 rounded-2xl" 
            />
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
              <Button type="submit" disabled={isSubmitting || !subject} className="w-full h-16 bg-primary text-primary-foreground font-black rounded-full text-lg shadow-2xl">
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
              <Button type="submit" disabled={isSubmitting || !subject || !jsonInput} className="w-full h-16 bg-primary text-primary-foreground font-black rounded-full text-lg shadow-2xl">
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Flash to Test Bank"}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
