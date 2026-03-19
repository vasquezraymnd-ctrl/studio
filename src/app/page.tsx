"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SynapseLogo } from "@/components/synapse-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FirebaseMock } from "@/lib/firebase-mock";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await FirebaseMock.auth.signIn(email);
      localStorage.setItem('synapse_user', JSON.stringify(user));
      if (user.role === 'teacher') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <SynapseLogo className="w-24 h-24 text-primary" />
          <h1 className="text-4xl font-headline font-bold text-foreground tracking-tight">SYNAPSE</h1>
          <p className="text-muted-foreground font-body text-center">Accelerate your path to becoming a Registered Medical Technologist.</p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the gauntlet.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="email" 
                  placeholder="name@university.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  className="bg-background border-border focus:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                Access Portal
              </Button>
            </form>
            <div className="mt-6 text-center text-xs text-muted-foreground">
              Use <span className="text-primary font-bold">admin@synapse.com</span> for teacher access
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}