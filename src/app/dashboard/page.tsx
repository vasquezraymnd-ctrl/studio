"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FirebaseMock, Module, User } from "@/lib/firebase-mock";
import { BookOpen, Trophy, Play, Download, LogOut } from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('synapse_user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(storedUser));
    FirebaseMock.db.getModules().then(setModules);
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-headline font-bold">S</div>
            <span className="font-headline font-bold tracking-tight">SYNAPSE</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
            <Button variant="ghost" size="icon" onClick={() => {
              localStorage.removeItem('synapse_user');
              router.push('/');
            }}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-primary text-white border-none shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Ready for the Gauntlet?</CardTitle>
              <CardDescription className="text-white/80">The Clinical Laboratory Science Assessment consists of 100 high-yield items.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/quiz')} className="bg-white text-primary hover:bg-secondary font-bold">
                <Play className="mr-2 fill-primary" /> Start Assessment
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Your Progress</CardTitle>
              <Trophy className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2/5 Passed</div>
              <p className="text-xs text-muted-foreground">Keep pushing for the RMT title!</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="bg-muted border border-border">
            <TabsTrigger value="materials" className="data-[state=active]:bg-primary">Study Materials</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary">Past Attempts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="materials" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((mod) => (
                <Card key={mod.id} className="bg-card/50 border-border hover:border-primary/50 transition-colors group">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{mod.title}</CardTitle>
                    <CardDescription>{mod.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-6 pt-0">
                    <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white" asChild>
                      <a href={mod.downloadLink} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 w-4 h-4" /> View PDF
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
              <p>No recent assessment attempts found.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function CardFooter({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={className}>{children}</div>;
}