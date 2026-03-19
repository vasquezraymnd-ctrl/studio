"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FirebaseMock, User, Module } from "@/lib/firebase-mock";
import { useToast } from "@/hooks/use-toast";
import { Plus, Link as LinkIcon, FileText, ChevronRight, LogOut, LayoutDashboard } from "lucide-react";

export default function AdminPortal() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('synapse_user');
    if (!storedUser || JSON.parse(storedUser).role !== 'teacher') {
      router.push('/');
      return;
    }
    setUser(JSON.parse(storedUser));
    FirebaseMock.db.getModules().then(setModules);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newMod = await FirebaseMock.db.addModule({
        title,
        description,
        downloadLink: link
      });
      setModules([...modules, newMod as Module]);
      setTitle("");
      setDescription("");
      setLink("");
      toast({
        title: "Module Published",
        description: "The study material is now available to all students.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was an error publishing the module.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-headline font-bold">A</div>
            <span className="font-headline font-bold tracking-tight">ADMIN PORTAL</span>
          </div>
          <Button variant="ghost" onClick={() => {
            localStorage.removeItem('synapse_user');
            router.push('/');
          }}>
            <LogOut className="w-5 h-5 mr-2" /> Log Out
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-primary/20 bg-card/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  New Module
                </CardTitle>
                <CardDescription>Upload material via direct links from Cloud Storage (Drive/Dropbox).</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Module Title</label>
                    <Input 
                      placeholder="e.g. Clinical Microscopy" 
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</label>
                    <Textarea 
                      placeholder="Describe the content of this material..." 
                      className="min-h-[100px]"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Direct Download Link</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="https://drive.google.com/..." 
                        className="pl-10"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    Publish to Student View
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Current Modules List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold">Published Materials</h3>
              <span className="text-sm text-muted-foreground">{modules.length} modules active</span>
            </div>
            
            <div className="space-y-3">
              {modules.map((mod) => (
                <div 
                  key={mod.id} 
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold truncate">{mod.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{mod.description}</p>
                    <p className="text-[10px] text-primary/70 mt-1 font-code truncate">{mod.downloadLink}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="group-hover:text-primary" asChild>
                    <a href={mod.downloadLink} target="_blank" rel="noopener noreferrer">
                      <ChevronRight className="w-5 h-5" />
                    </a>
                  </Button>
                </div>
              ))}

              {modules.length === 0 && (
                <div className="text-center py-20 bg-card/20 rounded-2xl border-2 border-dashed border-border">
                  <LayoutDashboard className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                  <p className="text-muted-foreground">No modules published yet. Use the form to start.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}