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

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isSignUp) {
      initiateEmailSignUp(auth, email, password, (error) => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Account Creation Failed",
          description: error.message || "Could not create your account.",
        });
      });
    } else {
      initiateEmailSignIn(auth, email, password, (error) => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password.",
        });
      });
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm space-y-12">
        <div className="flex flex-col items-center space-y-8">
          <SynapseLogo className="w-40 h-40" />
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-white">SYNAPSE</h1>
            <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-[10px]">Medical Study Hub</p>
          </div>
        </div>

        <Card className="spotify-glass border-none">
          <CardContent className="pt-8">
            <form onSubmit={handleAuth} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-widest">Email</label>
                <Input 
                  type="email" 
                  placeholder="name@future.rmt" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-widest">Password</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-primary"
                />
              </div>
              <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full text-lg mt-4" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Get Started" : "Sign In")}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em]"
              >
                {isSignUp ? "Already a member? Log In" : "New RMT? Create Account"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}