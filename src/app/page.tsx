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
      setIsLoading(false);
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
          description: error.message || "Could not create your account. Please try again.",
        });
      });
    } else {
      initiateEmailSignIn(auth, email, password, (error) => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please check your credentials.",
        });
      });
    }
  };

  if (isUserLoading && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-12">
        <div className="flex flex-col items-center space-y-6">
          <SynapseLogo className="w-32 h-32" />
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-extrabold tracking-tighter text-white">SYNAPSE</h1>
            <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">Medical Assessment Hub</p>
          </div>
        </div>

        <Card className="spotify-glass border-none shadow-2xl">
          <CardContent className="pt-8">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Email Address</label>
                <Input 
                  type="email" 
                  placeholder="future.rmt@synapse.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-white/5 border-white/10 focus:border-primary focus:ring-primary rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Password</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-white/5 border-white/10 focus:border-primary focus:ring-primary rounded-xl"
                />
              </div>
              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full text-lg mt-4 transition-transform active:scale-95" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : (isSignUp ? "Create Account" : "Sign In")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create one"}
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Built for Future Registered Medical Technologists.
        </p>
      </div>
    </div>
  );
}
