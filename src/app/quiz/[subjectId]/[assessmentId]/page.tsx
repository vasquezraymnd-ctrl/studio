
"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { 
  Timer, 
  LayoutGrid, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  CheckCircle2, 
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { useMemoFirebase } from "@/firebase/provider";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AssessmentEngine() {
  const { subjectId, assessmentId } = useParams();
  const router = useRouter();
  const db = useFirestore();

  const docRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, "subjects", subjectId as string, "assessments", assessmentId as string);
  }, [db, subjectId, assessmentId]);

  const { data: assessment, isLoading } = useDoc(docRef);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [validated, setValidated] = useState<Record<number, boolean>>({});
  const [analysisMode, setAnalysisMode] = useState(false);
  
  // HUD
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
      setCurrentIndex(currentIndex + 1);
      setTempSelection(answers[currentIndex + 1] ?? null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const score = assessment.questions.reduce((acc, q, idx) => acc + (answers[idx] === q.a ? 1 : 0), 0);
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
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* HUD Header */}
      <header className="h-24 px-6 flex items-center justify-between spotify-glass border-none z-50">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowExplorer(!showExplorer)}
            className={cn("h-12 w-12 rounded-2xl", showExplorer ? "bg-primary text-primary-foreground" : "bg-white/5 text-primary")}
          >
            <LayoutGrid className="w-6 h-6" />
          </Button>
          <div className="hidden sm:block">
            <h3 className="font-black text-white truncate max-w-[150px]">{assessment.title}</h3>
            <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Active Session</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowTimer(!showTimer)}
            className="h-12 w-12 rounded-2xl bg-white/5 text-muted-foreground"
          >
            {showTimer ? <Timer className="w-6 h-6 text-primary" /> : <EyeOff className="w-6 h-6" />}
          </Button>
          {showTimer && (
            <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 font-black text-primary">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </header>

      {/* Explorer Overlay */}
      {showExplorer && (
        <div className="fixed inset-x-0 top-24 bottom-32 bg-[#0B1F3C]/95 backdrop-blur-2xl z-40 p-6">
          <h2 className="text-[10px] font-black uppercase text-center mb-6 tracking-widest opacity-50">Navigation Matrix</h2>
          <ScrollArea className="h-full">
            <div className="grid grid-cols-5 gap-3 pb-20">
              {assessment.questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentIndex(i); setTempSelection(answers[i] ?? null); setShowExplorer(false); }}
                  className={cn(
                    "aspect-square rounded-2xl flex items-center justify-center text-xs font-black border transition-all",
                    currentIndex === i ? "bg-primary text-primary-foreground border-primary" :
                    validated[i] ? "bg-white/10 text-white/50 border-white/5" : "bg-white/5 text-white/20 border-white/5"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Quiz Area */}
      <main className="flex-1 overflow-auto p-6 md:p-12">
        <div className="max-w-2xl mx-auto space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Item {currentIndex + 1} of {assessment.questions.length}</span>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tighter">
              {currentQ.q}
            </h2>
          </div>

          <div className="space-y-4">
            {currentQ.options.map((option, idx) => {
              let btnStyle = "bg-white/5 border-white/5 text-white/80 hover:bg-white/10";
              if (analysisMode || isAnswered) {
                if (idx === currentQ.a) btnStyle = "bg-primary text-primary-foreground border-primary scale-105 shadow-xl font-bold";
                else if (idx === answers[currentIndex]) btnStyle = "bg-destructive/20 border-destructive/30 text-destructive line-through";
                else btnStyle = "opacity-20 border-transparent";
              } else if (tempSelection === idx) {
                btnStyle = "bg-primary/20 border-primary shadow-inner ring-1 ring-primary/30";
              }

              return (
                <button
                  key={idx}
                  disabled={analysisMode || isAnswered}
                  onClick={() => setTempSelection(idx)}
                  className={cn("w-full text-left p-6 rounded-[2rem] border transition-all flex items-center gap-5", btnStyle)}
                >
                  <span className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-sm font-black shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-lg font-bold leading-snug">{option}</span>
                </button>
              );
            })}
          </div>

          {(analysisMode || isAnswered) && currentQ.rationale && (
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 animate-in slide-in-from-bottom-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Analysis & Rationale</p>
              </div>
              <p className="text-muted-foreground text-sm font-bold leading-relaxed">{currentQ.rationale}</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer Nav */}
      <footer className="h-32 px-6 spotify-glass border-none z-50 flex items-center justify-center rounded-t-[3rem]">
        <div className="max-w-2xl w-full flex items-center justify-between gap-6">
          <Button 
            variant="ghost" 
            onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setTempSelection(answers[currentIndex - 1] ?? null); }}
            disabled={currentIndex === 0}
            className="text-muted-foreground font-black uppercase text-[10px] tracking-widest"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Prev
          </Button>

          <Progress value={(Object.keys(answers).length / assessment.questions.length) * 100} className="h-2 bg-white/5 flex-1 mx-4" />

          {(!isAnswered && !analysisMode) ? (
            <Button 
              onClick={handleConfirm} 
              disabled={tempSelection === null}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full px-10 h-16 text-lg shadow-2xl"
            >
              Confirm
            </Button>
          ) : (
            <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-full px-10 h-16 text-lg">
              {currentIndex === assessment.questions.length - 1 ? "Result" : "Next"} <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
      <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      <p className="text-[10px] font-black uppercase text-primary tracking-[0.5em]">Syncing Assessment</p>
    </div>
  );
}

function ErrorState({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background p-8 text-center space-y-6">
      <AlertCircle className="w-20 h-20 text-muted-foreground opacity-20" />
      <h2 className="text-3xl font-black text-white">BANK OFFLINE</h2>
      <Button onClick={onBack} className="rounded-full px-10 h-14 spotify-glass border-none text-white font-black">Return to Subject</Button>
    </div>
  );
}

function ResultScreen({ score, total, onReview, onBack }: { score: number, total: number, onReview: () => void, onBack: () => void }) {
  const isPass = total > 0 && (score / total) >= 0.75;
  return (
    <div className="h-screen flex flex-col items-center justify-center p-12 text-center bg-background animate-in fade-in duration-700">
      <div className="relative mb-12">
        <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
          <Award className={cn("w-24 h-24", isPass ? "text-primary" : "text-muted-foreground")} />
        </div>
        {isPass && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-primary font-black px-8 py-3 rounded-full text-xl shadow-2xl rotate-[-3deg] border-2 border-primary">
            FUTURE RMT
          </div>
        )}
      </div>
      <h3 className="text-5xl font-black text-white tracking-tighter mb-2">{isPass ? "HUGE WIN" : "KEEP PUSHING"}</h3>
      <p className="text-primary font-black text-2xl uppercase tracking-widest mb-12">{score} / {total}</p>
      <div className="w-full max-w-xs space-y-4">
        <Button onClick={onBack} className="w-full h-16 bg-primary text-primary-foreground font-black rounded-full text-xl">Continue to Hub</Button>
        <Button variant="ghost" onClick={onReview} className="w-full h-14 text-muted-foreground font-black uppercase tracking-widest hover:text-white">Analysis Mode</Button>
      </div>
    </div>
  );
}
