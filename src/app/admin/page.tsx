"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";
import { Plus, Link as LinkIcon, FileText, ChevronRight, LayoutDashboard, Loader2, Trash2, ShieldAlert } from "lucide-react";
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
      title: "Module Released",
      description: "Successfully added to the study playlist.",
    });
  };

  const handleDelete = async (moduleId: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "studyModules", moduleId));
      toast({ title: "Deleted", description: "Module removed from library." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete module." });
    }
  };

  if (isUserLoading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="px-8 py-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black text-2xl shadow-lg">A</div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Admin Portal</h1>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Content Pipeline</p>
          </div>
        </div>
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="text-muted-foreground font-black text-xs uppercase tracking-widest hover:text-white">
          <LayoutDashboard className="w-5 h-5 mr-2" /> Exit Lab
        </Button>
      </header>

      <main className="flex-1 px-8 pb-32 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Upload Form */}
        <div className="lg:col-span-5">
          <Card className="spotify-glass border-none rounded-[2.5rem] shadow-2xl">
            <CardHeader className="p-8">
              <CardTitle className="flex items-center gap-3 text-2xl font-black text-white">
                <Plus className="w-6 h-6 text-primary" />
                New Release
              </CardTitle>
              <CardDescription className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Post Study Materials</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Module Title</label>
                  <Input 
                    placeholder="e.g., Hematology Masterclass" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    className="h-14 bg-white/5 border-white/10 rounded-[1.2rem] focus:border-primary px-5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Description</label>
                  <Textarea 
                    placeholder="Brief overview of contents..." 
                    className="min-h-[120px] bg-white/5 border-white/10 rounded-[1.5rem] focus:border-primary p-5"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">External Link</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <Input 
                      placeholder="Google Drive / Dropbox Link" 
                      className="pl-14 h-14 bg-white/5 border-white/10 rounded-[1.2rem] focus:border-primary"
                      value={link}
                      onChange={e => setLink(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full mt-6 text-lg shadow-2xl shadow-primary/20" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Publish to Library"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Inventory List */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">Active Catalog</h3>
            <Badge variant="outline" className="text-[9px] font-black text-primary border-primary/20">{modules?.length || 0} Modules</Badge>
          </div>
          
          <div className="space-y-4">
            {modulesLoading ? (
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mt-20" />
            ) : modules?.length === 0 ? (
              <div className="text-center py-32 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10 opacity-50">
                <ShieldAlert className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                <p className="text-muted-foreground font-black text-sm uppercase tracking-widest">Library is empty</p>
              </div>
            ) : (
              modules?.map((mod) => (
                <div 
                  key={mod.id} 
                  className="flex items-center gap-6 p-6 rounded-[2rem] spotify-glass group hover:scale-[1.01] transition-transform"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-white text-lg truncate">{mod.title}</h4>
                    <p className="text-xs text-muted-foreground font-bold truncate opacity-80">{mod.description}</p>
                    <p className="text-[9px] text-primary/50 mt-1 font-mono truncate">{mod.downloadLink}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white" asChild>
                      <a href={mod.downloadLink} target="_blank" rel="noopener noreferrer">
                        <ChevronRight className="w-6 h-6" />
                      </a>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(mod.id)} 
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}