
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SynapseLogo } from "@/components/synapse-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth, useUser } from "@/firebase";
import { initiateEmailSignIn, initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "@/components/mode-toggle";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user && !isSplashLoading) {
      router.push('/dashboard');
    }
  }, [user, router, isSplashLoading]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isSignUp) {
      initiateEmailSignUp(auth, email, password, (error) => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Portal Access Denied",
          description: error.message || "Could not create your registration.",
        });
      });
    } else {
      initiateEmailSignIn(auth, email, password, (error) => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "Invalid email or access key.",
        });
      });
    }
  };

  if (isSplashLoading || isUserLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-6 space-y-8 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/20 animate-ping absolute" />
          <SynapseLogo className="w-24 h-24 relative" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-[0.3em] animate-pulse">SYNAPSE</h1>
          <p className="text-primary font-black text-[10px] uppercase tracking-[0.5em]">WELCOME FUTURE RMT</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="absolute top-8 right-8">
        <ModeToggle />
      </div>
      
      <div className="w-full max-sm:max-w-xs max-w-sm space-y-10">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative mb-2">
            <div className="w-4 h-4 rounded-full bg-primary animate-ping absolute" />
            <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(0,229,255,0.8)]" />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black tracking-tighter">SYNAPSE</h1>
            <p className="font-bold uppercase tracking-widest text-[9px] text-primary">
              Next-Gen review for Next-Gen RMTs
            </p>
          </div>
        </div>

        <Card className="spotify-glass border-none rounded-[2.5rem] shadow-2xl overflow-hidden">
          <CardContent className="pt-10">
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground ml-2 tracking-widest">Student Email</label>
                <Input 
                  type="email" 
                  placeholder="student@reviewcenter.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 bg-background/50 border-border rounded-2xl focus:border-primary px-6"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground ml-2 tracking-widest">Access Key</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 bg-background/50 border-border rounded-2xl focus:border-primary px-6"
                />
              </div>
              <Button type="submit" className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full text-xl mt-4 shadow-xl shadow-primary/10 transition-transform active:scale-95" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Register" : "Access Portal")}
              </Button>
            </form>

            <div className="mt-8 text-center pb-4">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em]"
              >
                {isSignUp ? "Existing Student? Login" : "New Student? Enroll Here"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
