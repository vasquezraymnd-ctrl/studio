"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, limit } from "firebase/firestore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Timer, LayoutGrid, Eye, EyeOff, X, AlertCircle, ChevronLeft, ChevronRight, Award, CheckCircle2 } from "lucide-react";
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
  
  // HUD Controls
  const [showTimer, setShowTimer] = useState(true);
  const [showItemList, setShowItemList] = useState(false);
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

  const handleSelectOption = (idx: number) => {
    if (validated[currentIndex]) return;
    setSelectedOption(idx);
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

  if (isLoading) return <SynapseLoadingPulse />;

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight">QUIZ EMPTY</h2>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xs mx-auto">Assessment bank is currently offline.</p>
        </div>
        <Button onClick={() => router.push('/dashboard')} className="rounded-full px-10 h-14 bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-colors">
          Return Home
        </Button>
      </div>
    );
  }

  if (isFinished) {
    const score = questions.reduce((acc, q, idx) => acc + (answers[idx] === q.correctAnswerIndex ? 1 : 0), 0);
    return <CelebrationScreen score={score} total={questions.length} onBack={() => router.push('/dashboard')} />;
  }

  const currentQ = questions[currentIndex];
  const isAnswered = validated[currentIndex];

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden font-body">
      {/* HUD Header */}
      <header className="h-24 px-6 flex items-center justify-between spotify-glass z-50 border-none">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowItemList(!showItemList)} 
            className={cn("rounded-2xl h-12 w-12 transition-all", showItemList ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-primary bg-primary/10")}
          >
            <LayoutGrid className="w-6 h-6" />
          </Button>
          <div className="hidden sm:block">
            <h3 className="font-black text-white text-lg tracking-tight">THE GAUNTLET</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Med-Tech Assessment</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowTimer(!showTimer)} 
            className={cn("rounded-2xl h-12 w-12", showTimer ? "text-primary bg-primary/10" : "text-muted-foreground bg-white/5")}
          >
            {showTimer ? <Timer className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
          </Button>
          {showTimer && (
            <div className={cn(
              "font-black text-xl px-5 py-2 rounded-2xl border transition-all",
              timeLeft < 300 ? "text-destructive border-destructive/20 bg-destructive/5 animate-pulse" : "text-primary border-primary/20 bg-primary/5"
            )}>
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </header>

      {/* Item Navigator Overlay */}
      {showItemList && (
        <div className="fixed inset-x-0 top-24 bottom-24 bg-[#0B1F3C]/95 backdrop-blur-2xl z-40 p-6 animate-in fade-in slide-in-from-top-4">
          <div className="max-w-xl mx-auto h-full flex flex-col space-y-6">
            <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-muted-foreground text-center">Item Explorer</h2>
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-5 gap-3 pb-20">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentIndex(i);
                      setSelectedOption(answers[i] ?? null);
                      setShowItemList(false);
                    }}
                    className={cn(
                      "aspect-square rounded-2xl flex items-center justify-center text-xs font-black transition-all border",
                      currentIndex === i ? "bg-primary text-primary-foreground border-primary scale-110 shadow-xl" : 
                      validated[i] ? "bg-white/10 text-white/50 border-white/5" : "bg-white/5 text-white/20 border-white/5"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Main Quiz Area */}
      <main className="flex-1 overflow-auto p-6 md:p-12 scrollbar-hide bg-transparent relative">
        <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-500">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-primary font-black text-[10px] tracking-[0.4em] uppercase">Item {currentIndex + 1} of {questions.length}</span>
              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground border-white/10 px-3 py-1">{currentQ.category}</Badge>
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-tight text-white tracking-tighter">
              {currentQ.text}
            </h2>
          </div>

          <div className="space-y-4">
            {currentQ.options.map((option, idx) => {
              let style = "bg-white/5 border-white/5 hover:bg-white/10 active:scale-[0.98]";
              if (isAnswered) {
                if (idx === currentQ.correctAnswerIndex) style = "bg-primary text-primary-foreground border-primary shadow-2xl scale-105 z-10 font-bold";
                else if (idx === answers[currentIndex]) style = "bg-destructive/20 border-destructive/30 text-destructive line-through opacity-80";
                else style = "opacity-20 border-transparent";
              } else if (selectedOption === idx) {
                style = "bg-primary/20 border-primary shadow-[0_0_30px_rgba(0,229,255,0.1)] ring-1 ring-primary/20 scale-[1.02]";
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={cn(
                    "w-full text-left p-6 rounded-[2rem] border transition-all flex items-center gap-5",
                    style
                  )}
                >
                  <span className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 shadow-inner",
                    isAnswered && idx === currentQ.correctAnswerIndex ? "bg-primary-foreground/20" : "bg-black/20"
                  )}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-lg md:text-xl font-bold leading-tight">{option}</span>
                </button>
              );
            })}
          </div>

          {isAnswered && currentQ.explanation && (
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 animate-in slide-in-from-bottom-4 duration-500 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Key Rationale</p>
              </div>
              <p className="text-muted-foreground text-sm font-bold leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}
        </div>
      </main>
      
      {/* HUD Bottom Footer */}
      <footer className="h-32 px-6 spotify-glass border-none z-50 flex items-center justify-center rounded-t-[3rem]">
        <div className="max-w-2xl w-full flex items-center justify-between gap-8">
          <Button 
            variant="ghost" 
            className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] hover:text-white" 
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Prev
          </Button>
          
          <div className="flex-1 space-y-2 px-4">
             <Progress value={(Object.keys(answers).length / questions.length) * 100} className="h-2 bg-white/5" />
          </div>

          {!isAnswered ? (
            <Button 
              onClick={handleSubmitItem} 
              disabled={selectedOption === null}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full px-12 h-16 text-lg shadow-2xl shadow-primary/30 transition-transform active:scale-95"
            >
              Submit
            </Button>
          ) : (
            <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full px-12 h-16 text-lg shadow-2xl shadow-primary/30">
              {currentIndex === questions.length - 1 ? "Finish" : "Next"} <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

function SynapseLoadingPulse() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-background">
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-primary/20 animate-ping absolute" />
        <div className="w-32 h-32 rounded-full bg-primary/30 animate-pulse flex items-center justify-center relative border border-primary/20 shadow-[0_0_50px_rgba(0,229,255,0.1)]">
          <div className="w-16 h-16 bg-primary rounded-full shadow-2xl" />
        </div>
      </div>
      <p className="text-[11px] font-black uppercase tracking-[0.6em] text-primary animate-pulse">Initializing Synapse</p>
    </div>
  );
}

function CelebrationScreen({ score, total, onBack }: { score: number, total: number, onBack: () => void }) {
  const isPass = total > 0 && (score / total) >= 0.75;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-background">
      {isPass && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i} 
              className="confetti-cyan" 
              style={{ 
                left: `${Math.random() * 100}%`, 
                animationDelay: `${Math.random() * 3}s`,
                width: `${Math.random() * 12 + 6}px`,
                height: `${Math.random() * 12 + 6}px`,
                background: i % 2 === 0 ? '#00E5FF' : '#FFFFFF'
              }} 
            />
          ))}
        </div>
      )}
      
      <div className="max-w-md space-y-16 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative">
          <div className="w-56 h-56 mx-auto rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20 shadow-2xl">
            <Award className={cn("w-28 h-28 transition-all duration-1000", isPass ? "text-primary scale-110" : "text-muted-foreground")} />
          </div>
          {isPass && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white text-primary font-black px-10 py-4 rounded-full text-2xl shadow-2xl rotate-[-3deg] border-4 border-primary tracking-tighter">
              FUTURE RMT
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-6xl font-black tracking-tighter text-white uppercase">{isPass ? "HUGE WIN" : "HUNGRY?"}</h2>
          <p className="text-muted-foreground text-xl font-bold uppercase tracking-widest">
            Score: <span className="text-primary">{score} / {total}</span>
          </p>
        </div>

        <div className="grid gap-4">
          <Button onClick={onBack} className="w-full bg-primary hover:bg-primary/90 h-16 rounded-full text-primary-foreground font-black text-xl shadow-2xl shadow-primary/30">Continue to Hub</Button>
          <Button variant="ghost" onClick={() => window.location.reload()} className="w-full h-16 rounded-full text-muted-foreground font-black text-sm uppercase tracking-widest hover:text-white">Retake Playlist</Button>
        </div>
      </div>
    </div>
  );
}