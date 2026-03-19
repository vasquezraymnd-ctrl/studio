"use client"

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, limit } from "firebase/firestore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Timer, LayoutGrid, Eye, EyeOff, CheckCircle2, ChevronRight, ChevronLeft, Award, X } from "lucide-react";
import { useMemoFirebase } from "@/firebase/provider";

export default function QuizScreen() {
  const router = useRouter();
  const db = useFirestore();
  
  const questionsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "questions"), limit(100));
  }, [db]);

  const { data: questions, isLoading } = useCollection(questionsQuery);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [validated, setValidated] = useState<Record<number, boolean>>({});
  const [showTimer, setShowTimer] = useState(true);
  const [showNav, setShowNav] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  const handleSubmitItem = () => {
    if (selectedOption === null) return;
    setAnswers({ ...answers, [currentIndex]: selectedOption });
    setValidated({ ...validated, [currentIndex]: true });
  };

  const handleNext = () => {
    if (!questions) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(answers[currentIndex + 1] ?? null);
    } else {
      setIsFinished(true);
    }
  };

  if (isLoading || !questions) return (
    <div className="min-h-screen flex items-center justify-center">
      <SynapseLoadingPulse />
    </div>
  );

  if (isFinished) {
    const score = Object.values(answers).filter((a, i) => a === questions[i].correctAnswerIndex).length;
    return <CelebrationScreen score={score} total={questions.length} onBack={() => router.push('/dashboard')} />;
  }

  const currentQ = questions[currentIndex];
  const isCorrect = answers[currentIndex] === currentQ.correctAnswerIndex;
  const isAnswered = validated[currentIndex];

  return (
    <div className="flex h-screen bg-background overflow-hidden font-body relative">
      {/* HUD Navigation Sidebar (Spotify style) */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-72 spotify-glass z-40 transition-transform duration-300 ease-in-out border-r-0",
        showNav ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xs font-black tracking-widest uppercase text-muted-foreground">Item Navigator</h2>
          <Button variant="ghost" size="icon" onClick={() => setShowNav(false)} className="text-muted-foreground">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-80px)] p-4">
          <div className="grid grid-cols-5 gap-2 pb-24">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentIndex(i);
                  setSelectedOption(answers[i] ?? null);
                }}
                className={cn(
                  "w-full aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-all",
                  currentIndex === i ? "bg-primary text-primary-foreground scale-110 shadow-[0_0_15px_rgba(0,229,255,0.4)]" : 
                  validated[i] ? "bg-white/10 text-white/50" : "bg-white/5 text-white/20"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 px-6 flex items-center justify-between spotify-glass border-b-0 relative z-30">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setShowNav(!showNav)} className="text-primary bg-primary/10 rounded-xl">
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-none">Assessment</p>
              <h3 className="font-extrabold text-white">THE GAUNTLET</h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {showTimer && (
              <div className={cn(
                "font-mono text-lg font-black px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary",
                timeLeft < 300 && "animate-pulse text-destructive border-destructive/20 bg-destructive/5"
              )}>
                {formatTime(timeLeft)}
              </div>
            )}
            <Button onClick={() => setIsFinished(true)} variant="ghost" className="text-muted-foreground font-bold text-xs uppercase hover:text-white">
              Quit
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-12 scrollbar-hide">
          <div className="max-w-2xl mx-auto space-y-12">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-primary font-bold text-xs tracking-[0.3em] uppercase">Item {currentIndex + 1} of {questions.length}</span>
                <Badge variant="secondary" className="bg-white/5 text-muted-foreground text-[10px] font-bold border-none">{currentQ.category}</Badge>
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold leading-[1.15] text-white">
                {currentQ.text}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                let style = "bg-white/5 border-transparent hover:bg-white/10";
                if (isAnswered) {
                  if (idx === currentQ.correctAnswerIndex) style = "bg-primary text-primary-foreground font-bold shadow-[0_0_20px_rgba(0,229,255,0.3)]";
                  else if (idx === answers[currentIndex]) style = "bg-destructive/20 border-destructive/30 text-destructive line-through";
                  else style = "opacity-30";
                } else if (selectedOption === idx) {
                  style = "bg-primary/20 border-primary ring-2 ring-primary/20";
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => setSelectedOption(idx)}
                    className={cn(
                      "w-full text-left p-6 rounded-2xl border transition-all flex items-center gap-4 active:scale-[0.98]",
                      style
                    )}
                  >
                    <span className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-xs font-black shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-lg font-medium">{option}</span>
                  </button>
                );
              })}
            </div>

            {isAnswered && currentQ.explanation && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-xs font-black uppercase text-primary mb-2">Rationale</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 spotify-glass border-t-0 rounded-t-3xl">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-6">
            <Button variant="ghost" className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            
            <div className="flex-1 space-y-2">
               <Progress value={(Object.keys(answers).length / questions.length) * 100} className="h-1 bg-white/10" />
            </div>

            {!isAnswered ? (
              <Button 
                onClick={handleSubmitItem} 
                disabled={selectedOption === null}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-8 shadow-lg shadow-primary/20"
              >
                Submit
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-8">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SynapseLoadingPulse() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-primary/20 animate-ping absolute" />
      <div className="w-24 h-24 rounded-full bg-primary/40 animate-pulse flex items-center justify-center relative">
        <div className="w-12 h-12 bg-primary rounded-full" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Charging Synapse</p>
    </div>
  );
}

function CelebrationScreen({ score, total, onBack }: { score: number, total: number, onBack: () => void }) {
  const isPass = score >= 75;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {isPass && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i} 
              className="confetti-cyan" 
              style={{ 
                left: `${Math.random() * 100}%`, 
                animationDelay: `${Math.random() * 3}s`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
              }} 
            />
          ))}
        </div>
      )}
      
      <div className="max-w-md space-y-12 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <div className="w-48 h-48 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <Award className={cn("w-24 h-24", isPass ? "text-primary" : "text-muted-foreground")} />
          </div>
          {isPass && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-primary font-black px-6 py-2 rounded-full text-xl shadow-2xl rotate-[-2deg]">
              FUTURE RMT
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-5xl font-black tracking-tighter text-white">{isPass ? "HUGE WIN!" : "STAY HUNGRY"}</h2>
          <p className="text-muted-foreground text-lg font-medium">
            You secured <span className="text-primary font-bold">{score}/{total}</span> high-yield items.
          </p>
        </div>

        <div className="grid gap-3">
          <Button onClick={onBack} className="w-full bg-primary hover:bg-primary/90 h-14 rounded-full text-primary-foreground font-black text-lg shadow-xl">Back to Dashboard</Button>
          <Button variant="ghost" onClick={() => window.location.reload()} className="w-full h-14 rounded-full text-muted-foreground font-bold hover:text-white">Retake Gauntlet</Button>
        </div>
      </div>
    </div>
  );
}