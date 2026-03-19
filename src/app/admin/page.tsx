"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Database, FileJson, Link as LinkIcon, PlusCircle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Basic email-based admin check for prototype
    if (!isUserLoading && (!user || !user.email?.includes('admin'))) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !db) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "subjects", subject, "modules"), {
        title,
        description,
        url,
        dateAdded: new Date().toISOString()
      });
      toast({ title: "Module Deployed", description: "Successfully added to subject library." });
      setTitle(""); setDescription(""); setUrl("");
    } catch (e: any) {
      toast({ variant: "destructive", title: "Deployment Failed", description: e.message });
    }
    setIsSubmitting(false);
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !jsonInput || !db) return;
    setIsSubmitting(true);
    try {
      const parsed = JSON.parse(jsonInput);
      const assessmentRef = doc(collection(db, "subjects", subject, "assessments"));
      await setDoc(assessmentRef, {
        ...parsed,
        id: assessmentRef.id,
        totalItems: parsed.questions?.length || 0
      });
      toast({ title: "Quiz Deployed", description: "Assessment engine updated." });
      setJsonInput(""); setTitle("");
    } catch (e: any) {
      toast({ variant: "destructive", title: "JSON Syntax Error", description: "Please verify question format." });
    }
    setIsSubmitting(false);
  };

  if (isUserLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-6 pt-12 pb-8 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="p-0 text-muted-foreground hover:text-white">
          <ChevronLeft className="w-6 h-6 mr-1" /> Dashboard
        </Button>
        <div className="text-right">
          <h1 className="text-2xl font-black text-white tracking-tighter">COMMAND CENTER</h1>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Deployment pipeline</p>
        </div>
      </header>

      <main className="px-6 max-w-2xl mx-auto space-y-10 pb-20">
        <div className="flex gap-4">
          <Button 
            onClick={() => setMode('module')} 
            className={cn("flex-1 h-16 rounded-3xl font-black", mode === 'module' ? "bg-primary text-primary-foreground" : "spotify-glass border-none text-white")}
          >
            <PlusCircle className="mr-2" /> Add Module
          </Button>
          <Button 
            onClick={() => setMode('quiz')} 
            className={cn("flex-1 h-16 rounded-3xl font-black", mode === 'quiz' ? "bg-primary text-primary-foreground" : "spotify-glass border-none text-white")}
          >
            <Database className="mr-2" /> Bulk Quiz
          </Button>
        </div>

        <div className="spotify-glass rounded-[3rem] p-10 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Target Subject</label>
            <Select onValueChange={setSubject} value={subject}>
              <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl">
                <SelectValue placeholder="Select Pillar..." />
              </SelectTrigger>
              <SelectContent className="bg-[#0B1F3C] border-white/10">
                <SelectItem value="clinical-chemistry">Clinical Chemistry</SelectItem>
                <SelectItem value="microbiology">Microbiology</SelectItem>
                <SelectItem value="hematology">Hematology</SelectItem>
                <SelectItem value="blood-banking">Blood Banking</SelectItem>
                <SelectItem value="clinical-microscopy">Clinical Microscopy</SelectItem>
                <SelectItem value="mt-laws">MT Laws</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === 'module' ? (
            <form onSubmit={handleModuleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Module Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., CBC & Morphology" className="h-14 bg-white/5 border-white/10 rounded-2xl" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Resource Link (PDF/Video)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                  <Input value={url} onChange={e => setUrl(e.target.value)} required placeholder="Direct Download URL" className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl" />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-16 bg-primary text-primary-foreground font-black rounded-full text-lg shadow-2xl">
                Deploy Module
              </Button>
            </form>
          ) : (
            <form onSubmit={handleQuizSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center justify-between">
                  <span>JSON Payload (100 Items)</span>
                  <FileJson className="w-4 h-4" />
                </label>
                <Textarea 
                  value={jsonInput} 
                  onChange={e => setJsonInput(e.target.value)} 
                  required 
                  placeholder='{ "title": "Assessment 1", "questions": [...] }'
                  className="min-h-[300px] bg-white/5 border-white/10 rounded-3xl p-6 font-mono text-xs"
                />
              </div>
              <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 flex gap-4 items-center">
                <ShieldAlert className="w-8 h-8 text-destructive shrink-0" />
                <p className="text-[10px] text-destructive font-black uppercase tracking-widest">Deploying will overwrite existing metadata if IDs match.</p>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-16 bg-primary text-primary-foreground font-black rounded-full text-lg shadow-2xl">
                Flash to Test Bank
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
