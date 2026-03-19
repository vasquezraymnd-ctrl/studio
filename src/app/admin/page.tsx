"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";
import { Plus, Link as LinkIcon, FileText, ChevronRight, LogOut, LayoutDashboard, Loader2 } from "lucide-react";
import { useMemoFirebase } from "@/firebase/provider";

export default function AdminPortal() {
  const router = useRouter();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modulesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "studyModules"), orderBy("uploadDate", "desc"));
  }, [db]);

  const { data: modules, isLoading: modulesLoading } = useCollection(modulesQuery);

  // Simple admin check: In a real app, we'd check the /admins/{uid} document.
  // For prototyping, we'll allow access if the email contains admin.
  useEffect(() => {
    if (!isUserLoading && (!user || !user.email?.includes('admin'))) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    const colRef = collection(db, "studyModules");
    
    addDocumentNonBlocking(colRef, {
      title,
      description,
      downloadLink: link,
      uploadedById: user.uid,
      uploadDate: new Date().toISOString()
    });

    setTitle("");
    setDescription("");
    setLink("");
    setIsSubmitting(false);
    
    toast({
      title: "Module Published",
      description: "The material is now live in the student playlist.",
    });
  };

  if (isUserLoading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black">A</div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-widest text-white">Admin Lab</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Content Management</p>
          </div>
        </div>
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="text-muted-foreground font-bold hover:text-white">
          <LayoutDashboard className="w-5 h-5 mr-2" /> Exit Lab
        </Button>
      </header>

      <main className="flex-1 px-6 pb-24 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="spotify-glass border-none shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Plus className="w-5 h-5 text-primary" />
                New Release
              </CardTitle>
              <CardDescription className="text-muted-foreground">Upload via direct Drive/Dropbox links.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Title</label>
                  <Input 
                    placeholder="Hematology Part 1" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    className="h-11 bg-white/5 border-white/10 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Description</label>
                  <Textarea 
                    placeholder="High-yield CBC concepts..." 
                    className="min-h-[100px] bg-white/5 border-white/10 rounded-xl"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Direct Link</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="https://..." 
                      className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl"
                      value={link}
                      onChange={e => setLink(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full mt-4" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Publish to Library"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Active Library</h3>
          
          <div className="space-y-3">
            {modulesLoading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mt-12" />
            ) : modules?.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground font-medium">No published materials yet.</p>
              </div>
            ) : (
              modules?.map((mod) => (
                <div 
                  key={mod.id} 
                  className="flex items-center gap-4 p-5 rounded-2xl spotify-glass hover:bg-white/10 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate">{mod.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{mod.description}</p>
                    <p className="text-[10px] text-primary/70 mt-1 font-mono truncate">{mod.downloadLink}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white" asChild>
                    <a href={mod.downloadLink} target="_blank" rel="noopener noreferrer">
                      <ChevronRight className="w-6 h-6" />
                    </a>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}