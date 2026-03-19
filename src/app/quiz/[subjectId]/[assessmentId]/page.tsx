
"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFirestore, useDoc, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { 
  Timer, 
  LayoutGrid, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  HelpCircle,
  AlertCircle,
  X,
  CheckCircle2
} from "lucide-react";
import { useMemoFirebase } from "@/firebase/provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function AssessmentEngine() {
  const { subjectId, assessmentId } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();

  const docRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, "subjects", subjectId as string, "assessments", assessmentId as string);
  }, [db, subjectId, assessmentId]);

  const { data: assessment, isLoading } = useDoc(docRef);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [validated, setValidated] = useState<Record<number, boolean>>({});
  const [analysisMode, setAnalysisMode] = useState(false);
  
  const [showTimer, setShowTimer] = useState(true);
  const [showExplorer, setShowExplorer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isFinished, setIsFinished] = useState(false);
  const [tempSelection, setTempSelection] = useState<number | null>(null);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isFinished]);

  // Save progress when finished
  useEffect(() => {
    if (isFinished && user && db && assessment) {
      const score = assessment.questions.reduce((acc: number, q: any, idx: number) => acc + (answers[idx] === q.a ? 1 : 0), 0);
      const progressRef = doc(db, "users", user.uid, "progress", assessmentId as string);
      
      const progressData = {
        assessmentId,
        assessmentTitle: assessment.title,
        subjectId,
        score,
        total: assessment.questions.length,
        completedAt: new Date().toISOString()
      };

      setDocumentNonBlocking(progressRef, progressData, { merge: true });
    }
  }, [isFinished, user, db, assessment, assessmentId, subjectId, answers]);

  if (isLoading) return <LoadingState />;

  if (!assessment) return <ErrorState onBack={() => router.back()} />;

  const currentQ = assessment.questions[currentIndex];
  const isAnswered = validated[currentIndex];

  const handleConfirm = () => {
    if (tempSelection === null) return;
    setAnswers({ ...answers, [currentIndex]: tempSelection });
    setValidated({ ...validated, [currentIndex]: true });
  };

  const handleNext = () => {
    if (currentIndex < assessment.questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTempSelection(answers[nextIdx] ?? null);
    } else {
      setIsFinished(true);
    }
  };

  const handleJump = (idx: number) => {
    setCurrentIndex(idx);
    setTempSelection(answers[idx] ?? null);
    setShowExplorer(false);
  };

  if (isFinished) {
    const score = assessment.questions.reduce((acc: number, q: any, idx: number) => acc + (answers[idx] === q.a ? 1 : 0), 0);
    return (
      <ResultScreen 
        score={score} 
        total={assessment.questions.length} 
        onReview={() => { setIsFinished(false); setAnalysisMode(true); setCurrentIndex(0); }}
        onBack={() => router.push(`/subject/${subjectId}`)} 
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden font-body">
      {/* HUD Header */}
      <header className="h-24 px-6 flex items-center justify-between spotify-glass border-none z-50">
        <div className="flex items-center gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/5 text-muted-foreground hover:text-destructive">
                <X className="w-6 h-6" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="spotify-glass border-none rounded-[2.5rem] p-10">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black text-white tracking-tighter">TERMINATE SESSION?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground font-bold">
                  Exiting now will erase your current progress. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6 gap-4">
                <AlertDialogCancel className="rounded-full h-14 font-black border-white/10 hover:bg-white/5">Stay & Complete</AlertDialogCancel>
                <AlertDialogAction onClick={() => router.push(`/subject/${subjectId}`)} className="rounded-full h-14 font-black bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Terminate
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <div className="hidden sm:block ml-2">
            <h3 className="font-black text-white truncate max-w-[150px] uppercase leading-none">{assessment.title}</h3>
            <p className="text-[8px] font-black uppercase text-primary tracking-widest mt-1">Examination Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowTimer(!showTimer)}
            className={cn("h-12 w-12 rounded-2xl transition-all", showTimer ? "bg-primary/10 text-primary" : "bg-white/5 text-muted-foreground")}
          >
            {showTimer ? <Timer className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowExplorer(!showExplorer)}
            className={cn("h-12 w-12 rounded-2xl transition-all", showExplorer ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-white/5 text-primary")}
          >
            <LayoutGrid className="w-5 h-5" />
          </Button>

          {showTimer && (
            <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 font-black text-primary text-lg tabular-nums">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </header>

      {/* Explorer Overlay (Navigation Panel) */}
      {showExplorer && (
        <div className="fixed inset-x-0 top-24 bottom-32 bg-background/95 backdrop-blur-3xl z-40 p-6 animate-in slide-in-from-top-4">
          <div className="max-w-2xl mx-auto h-full flex flex-col">
            <h2 className="text-[10px] font-black uppercase text-center mb-8 tracking-[0.5em] text-muted-foreground">Item Matrix</h2>
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 pb-20">
                {assessment.questions.map((_: any, i: number) => {
                  const isCurrent = currentIndex === i;
                  const isAnsweredItem = validated[i];
                  return (
                    <button
                      key={i}
                      onClick={() => handleJump(i)}
                      className={cn(
                        "aspect-square rounded-2xl flex items-center justify-center text-xs font-black border transition-all duration-300",
                        isCurrent ? "bg-primary text-primary-foreground border-primary scale-110 shadow-xl" :
                        isAnsweredItem ? "bg-primary/20 text-primary border-primary/30" : "bg-white/5 text-white/20 border-white/5 hover:border-white/20"
                      )}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Quiz Area */}
      <main className="flex-1 overflow-auto p-6 md:p-12 scrollbar-hide">
        <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase text-primary tracking-[0.6em] ml-1">ITEM {currentIndex + 1} OF {assessment.questions.length}</span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tighter">
              {currentQ.q}
            </h2>
          </div>

          <div className="grid gap-4">
            {currentQ.options.map((option: string, idx: number) => {
              let stateStyle = "bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:scale-[1.01]";
              
              if (isAnswered || analysisMode) {
                if (idx === currentQ.a) stateStyle = "bg-primary text-primary-foreground border-primary shadow-xl font-bold scale-[1.03]";
                else if (idx === answers[currentIndex]) stateStyle = "bg-destructive/20 border-destructive/40 text-destructive line-through";
                else stateStyle = "opacity-30 border-transparent grayscale";
              } else if (tempSelection === idx) {
                stateStyle = "bg-primary/20 border-primary shadow-[0_0_40px_rgba(0,229,255,0.1)] ring-2 ring-primary/20 scale-[1.02] text-white";
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered || analysisMode}
                  onClick={() => setTempSelection(idx)}
                  className={cn("w-full text-left p-6 rounded-[2.5rem] border transition-all flex items-center gap-6 group", stateStyle)}
                >
                  <span className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-sm font-black shrink-0 transition-colors",
                    (isAnswered || analysisMode) && idx === currentQ.a ? "bg-primary-foreground/20" : "bg-black/30"
                  )}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-lg md:text-xl font-bold leading-tight">{option}</span>
                </button>
              );
            })}
          </div>

          {(isAnswered || analysisMode) && currentQ.rationale && (
            <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 animate-in zoom-in-95 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Rationalization</p>
              </div>
              <p className="text-muted-foreground text-sm font-bold leading-relaxed">{currentQ.rationale}</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer Nav */}
      <footer className="h-32 px-6 spotify-glass border-none z-50 flex items-center justify-center rounded-t-[4rem]">
        <div className="max-w-3xl w-full flex items-center justify-between gap-10">
          <Button 
            variant="ghost" 
            onClick={() => {
              const prevIdx = Math.max(0, currentIndex - 1);
              setCurrentIndex(prevIdx);
              setTempSelection(answers[prevIdx] ?? null);
            }}
            disabled={currentIndex === 0}
            className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.3em] h-14 px-6 rounded-2xl hover:text-white"
          >
            <ChevronLeft className="w-5 h-5 mr-2" /> Previous
          </Button>

          <div className="flex-1 space-y-3 hidden md:block">
            <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">
              <span>Progress</span>
              <span>{Math.round((Object.keys(answers).length / assessment.questions.length) * 100)}%</span>
            </div>
            <Progress value={(Object.keys(answers).length / assessment.questions.length) * 100} className="h-2 bg-white/5" />
          </div>

          {!isAnswered && !analysisMode ? (
            <Button 
              onClick={handleConfirm} 
              disabled={tempSelection === null}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full px-12 h-16 text-xl shadow-[0_20px_50px_rgba(0,229,255,0.3)] transition-all active:scale-95 disabled:opacity-20"
            >
              Confirm
            </Button>
          ) : (
            <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full px-12 h-16 text-xl shadow-[0_20px_50px_rgba(0,229,255,0.2)]">
              {currentIndex === assessment.questions.length - 1 ? "Results" : "Next Item"} <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background gap-8">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-primary/20 animate-ping absolute" />
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 relative">
          <div className="w-12 h-12 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
      <p className="text-[11px] font-black uppercase text-primary tracking-[0.6em] animate-pulse">Syncing Test Bank</p>
    </div>
  );
}

function ErrorState({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background p-10 text-center space-y-8">
      <div className="w-32 h-32 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="w-16 h-16 text-destructive/50" />
      </div>
      <div className="space-y-3">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">DATA LINK BROKEN</h2>
        <p className="text-muted-foreground font-bold text-sm max-w-xs mx-auto">This test bank is currently unreachable or does not exist.</p>
      </div>
      <Button onClick={onBack} className="rounded-full px-12 h-16 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-lg hover:bg-white/10 transition-colors">Return to Hub</Button>
    </div>
  );
}

function ResultScreen({ score, total, onReview, onBack }: { score: number, total: number, onReview: () => void, onBack: () => void }) {
  const isPass = total > 0 && (score / total) >= 0.75;
  
  return (
    <div className="h-screen flex flex-col items-center justify-center p-12 text-center bg-background animate-in fade-in duration-1000">
      <div className="relative mb-20">
        <div className="w-64 h-64 rounded-full bg-primary/5 flex items-center justify-center border-8 border-primary/10 relative">
          <Award className={cn("w-32 h-32 transition-all duration-1000", isPass ? "text-primary scale-110 drop-shadow-[0_0_30px_rgba(0,229,255,0.5)]" : "text-muted-foreground opacity-30")} />
        </div>
        {isPass && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white text-primary font-black px-12 py-5 rounded-full text-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] rotate-[-3deg] border-4 border-primary tracking-tighter animate-in slide-in-from-bottom-10 delay-500">
            FUTURE RMT
          </div>
        )}
      </div>
      
      <div className="space-y-4 mb-16">
        <h3 className="text-6xl font-black text-white tracking-tighter uppercase">{isPass ? "CONGRATULATIONS" : "STAY FOCUSED"}</h3>
        <div className="flex items-center justify-center gap-4">
           <span className="text-primary font-black text-4xl uppercase tracking-tighter">{score}</span>
           <span className="text-muted-foreground font-black text-2xl uppercase tracking-widest">/ {total}</span>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <Button onClick={onBack} className="w-full h-18 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full text-2xl uppercase tracking-tighter shadow-2xl py-8">Continue Review</Button>
        <Button variant="ghost" onClick={onReview} className="w-full h-16 text-muted-foreground font-black uppercase tracking-widest hover:text-white text-sm">Analysis Mode</Button>
      </div>
    </div>
  );
}
