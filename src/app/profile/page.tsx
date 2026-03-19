
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFirestore, useUser, useDoc, useCollection } from "@/firebase";
import { doc, collection, query, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronLeft, 
  User as UserIcon, 
  School, 
  Mail, 
  Trophy, 
  Calendar,
  Save,
  Loader2,
  Home,
  Zap,
  Grid
} from "lucide-react";
import { useMemoFirebase } from "@/firebase/provider";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

export default function StudentProfile() {
  const router = useRouter();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [school, setSchool] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  const progressRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, "users", user.uid, "progress"), orderBy("completedAt", "desc"));
  }, [db, user]);

  const { data: progressItems, isLoading: isProgressLoading } = useCollection(progressRef);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setSchool(profile.school || "");
    }
  }, [profile]);

  useEffect(() => {
    if (!isUserLoading && !user) router.push('/');
  }, [user, isUserLoading, router]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileRef || !user) return;
    setIsUpdating(true);

    const data = {
      displayName,
      school,
      email: user.email,
    };

    setDocumentNonBlocking(profileRef, data, { merge: true });
    toast({ title: "Profile Updated", description: "Your details have been saved." });
    setIsUpdating(false);
  };

  const isAdmin = user?.email?.toLowerCase().includes('admin');

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-background font-body">
      <header className="px-6 pt-12 pb-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="p-0 text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6 mr-1" /> Dashboard
        </Button>
        <div className="text-right">
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Reviewee Profile</h1>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mt-1">Active Session</p>
        </div>
      </header>

      <main className="px-6 space-y-10 max-w-2xl mx-auto">
        {/* Profile Card */}
        <section className="spotify-glass rounded-[3rem] p-10 space-y-8 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/5">
              <UserIcon className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white leading-none uppercase tracking-tighter">
                {displayName || user?.email?.split('@')[0]} RMT
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-2">Professional Progress</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-2">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                <Input 
                  value={displayName} 
                  onChange={e => setDisplayName(e.target.value)} 
                  placeholder="Enter your full name" 
                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:border-primary/50" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-2">School / Institution</label>
              <div className="relative">
                <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                <Input 
                  value={school} 
                  onChange={e => setSchool(e.target.value)} 
                  placeholder="e.g., University of Santo Tomas" 
                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:border-primary/50" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-2">Reviewee Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input 
                  value={user?.email || ""} 
                  disabled 
                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl opacity-50 cursor-not-allowed" 
                />
              </div>
            </div>

            <Button type="submit" disabled={isUpdating} className="w-full h-16 bg-primary text-primary-foreground font-black rounded-full text-lg shadow-2xl transition-all active:scale-95 hover:bg-primary/90">
              {isUpdating ? <Loader2 className="animate-spin" /> : <><Save className="mr-2 w-5 h-5" /> Save Profile</>}
            </Button>
          </form>
        </section>

        {/* Progress Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Session Performance</h3>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{progressItems?.length || 0} Attempts</span>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {isProgressLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-28 w-full rounded-[2rem] bg-white/5 animate-pulse" />
                ))
              ) : progressItems?.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
                  <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                  <p className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">No assessments completed yet.</p>
                </div>
              ) : (
                progressItems?.map((item) => (
                  <Card key={item.id} className="spotify-glass border-none rounded-[2rem] overflow-hidden group hover:bg-white/5 transition-colors shadow-lg">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-black text-white text-lg tracking-tight uppercase leading-none truncate">{item.assessmentTitle}</h4>
                            <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {new Date(item.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-2xl font-black text-primary leading-none">{item.score}</span>
                          <span className="text-xs font-black text-muted-foreground uppercase ml-1">/ {item.total}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[8px] font-black uppercase text-muted-foreground tracking-widest">
                          <span>Success Rate</span>
                          <span>{Math.round((item.score / item.total) * 100)}%</span>
                        </div>
                        <Progress value={(item.score / item.total) * 100} className="h-2 bg-white/5" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </section>
      </main>

      {/* Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-card/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-8 z-50 rounded-t-[3rem] shadow-2xl">
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-muted-foreground hover:text-primary transition-colors" onClick={() => router.push('/dashboard')}>
          <Home className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </Button>
        {isAdmin && (
          <Button variant="ghost" className="flex flex-col gap-1 items-center text-muted-foreground hover:text-primary transition-colors" onClick={() => router.push('/admin')}>
            <Zap className="w-7 h-7" />
            <span className="text-[9px] font-black uppercase tracking-widest">Admin</span>
          </Button>
        )}
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-muted-foreground hover:text-primary transition-colors" onClick={() => router.push('/library')}>
          <Grid className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Library</span>
        </Button>
        <Button variant="ghost" className="flex flex-col gap-1 items-center text-primary hover:bg-transparent">
          <UserIcon className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
        </Button>
      </nav>
    </div>
  );
}
