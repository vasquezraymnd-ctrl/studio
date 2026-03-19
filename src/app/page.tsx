
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SynapseLogo } from "@/components/synapse-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth, useUser } from "@/firebase";
import { initiateEmailSignIn, initiateEmailSignUp, initiatePasswordReset } from "@/firebase/non-blocking-login";
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

  const handleForgotPassword = () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your student email first to reset your password.",
      });
      return;
    }

    initiatePasswordReset(
      auth, 
      email, 
      () => {
        toast({
          title: "Reset Link Sent",
          description: `A password reset link has been sent to ${email}. Please check your inbox.`,
        });
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Reset Failed",
          description: error.message || "Could not process password reset request.",
        });
      }
    );
  };

  const BrandingHeader = () => (
    <div className="w-full flex flex-col items-center space-y-6 text-center animate-in fade-in zoom-in-95 duration-1000">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-primary/20 animate-ping absolute -inset-2" />
        <SynapseLogo className="w-24 h-24 relative filter drop-shadow-[0_0_30px_rgba(0,229,255,0.7)]" />
      </div>
      
      <div className="space-y-2 w-full">
        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none text-white drop-shadow-2xl">
          SYNAPSE
        </h1>
        <p className="font-black uppercase tracking-[0.4em] text-[9px] text-primary w-full text-center whitespace-nowrap opacity-90 drop-shadow-md">
          NEXT-GEN REVIEW FOR NEXT-GEN RMTS
        </p>
      </div>
    </div>
  );

  if (isSplashLoading || isUserLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-6 animate-in fade-in duration-500">
        <div className="w-full max-w-[400px]">
          <BrandingHeader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="absolute top-8 right-8">
        <div className="spotify-glass p-1 rounded-full">
          <ModeToggle />
        </div>
      </div>
      
      <div className="w-full max-w-[400px] space-y-12 flex flex-col items-center">
        <BrandingHeader />

        <Card className="spotify-glass border-none rounded-[3.5rem] shadow-2xl overflow-hidden w-full transition-all duration-500 hover:shadow-primary/10">
          <CardContent className="pt-14 px-10 pb-12 space-y-8">
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted-foreground ml-2 tracking-widest opacity-70">Student Email</label>
                <Input 
                  type="email" 
                  placeholder="student@synapse.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-16 bg-background/50 border-white/5 rounded-3xl focus:border-primary px-8 text-lg"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-70">Access Key</label>
                  {!isSignUp && (
                    <button 
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[9px] font-black text-primary/60 hover:text-primary uppercase tracking-widest transition-colors"
                    >
                      Forgot Key?
                    </button>
                  )}
                </div>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-16 bg-background/50 border-white/5 rounded-3xl focus:border-primary px-8 text-lg"
                />
              </div>
              <Button type="submit" className="w-full h-20 py-8 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full text-xl mt-4 shadow-2xl shadow-primary/20 transition-transform active:scale-95" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Register Account" : "Access Portal")}
              </Button>
            </form>

            <div className="text-center pt-2">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.4em]"
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
