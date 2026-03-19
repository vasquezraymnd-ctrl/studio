"use client"

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FirebaseMock, Question } from "@/lib/firebase-mock";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Timer, LayoutGrid, Eye, EyeOff, CheckCircle2, ChevronRight, ChevronLeft, Award } from "lucide-react";

export default function QuizScreen() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [validated, setValidated] = useState<Record<number, boolean>>({});
  const [showTimer, setShowTimer] = useState(true);
  const [showNav, setShowNav] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    FirebaseMock.db.getQuestions().then(setQuestions);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const handleOptionSelect = (idx: number) => {
    if (validated[currentIndex]) return;
    setSelectedOption(idx);
  };

  const handleSubmitItem = () => {
    if (selectedOption === null) return;
    setAnswers({ ...answers, [currentIndex]: selectedOption });
    setValidated({ ...validated, [currentIndex]: true });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(answers[currentIndex + 1] ?? null);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(answers[currentIndex - 1] ?? null);
    }
  };

  if (questions.length === 0) return null;

  if (isFinished) {
    return <CelebrationScreen score={Object.values(answers).filter((a, i) => a === questions[i].correctAnswer).length} total={questions.length} onBack={() => router.push('/dashboard')} />;
  }

  const currentQ = questions[currentIndex];
  const isCorrect = answers[currentIndex] === currentQ.correctAnswer;
  const isAnswered = validated[currentIndex];

  return (
    <div className="flex h-screen bg-background overflow-hidden font-body">
      {/* HUD Navigation Sidebar */}
      {showNav && (
        <aside className="w-80 border-r border-border bg-card/50 flex flex-col transition-all">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-headline font-bold flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-primary" />
              ITEM NAVIGATOR
            </h2>
            <Badge variant="outline" className="text-xs">{Object.keys(answers).length}/100</Badge>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentIndex(i);
                    setSelectedOption(answers[i] ?? null);
                  }}
                  className={cn(
                    "w-full aspect-square rounded flex items-center justify-center text-xs font-bold transition-all border",
                    currentIndex === i ? "border-primary scale-110 z-10" : "border-border",
                    validated[i] ? (answers[i] === questions[i].correctAnswer ? "bg-primary text-white" : "bg-destructive text-white") : "bg-muted text-muted-foreground"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>
      )}

      {/* Main Assessment Area */}
      <main className="flex-1 flex flex-col relative">
        {/* HUD Controls Header */}
        <header className="h-16 border-b border-border bg-card/30 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setShowNav(!showNav)}>
              {showNav ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showNav ? "Hide Nav" : "Show Nav"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowTimer(!showTimer)}>
              <Timer className="w-4 h-4 mr-2" />
              {showTimer ? "Hide Timer" : "Show Timer"}
            </Button>
          </div>
          {showTimer && (
            <div className={cn(
              "font-code text-xl font-bold px-4 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary",
              timeLeft < 300 && "animate-pulse text-destructive border-destructive/20 bg-destructive/5"
            )}>
              {formatTime(timeLeft)}
            </div>
          )}
          <Button onClick={() => setIsFinished(true)} variant="outline" className="border-primary text-primary">
            Submit Assessment
          </Button>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-12">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-primary font-headline text-lg tracking-widest uppercase">Question {currentIndex + 1} of 100</span>
                <Badge variant="secondary" className="bg-secondary/20 text-secondary">Clinical Laboratory Science</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-headline font-bold leading-tight">
                {currentQ.text}
              </h1>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                let optionStyle = "border-border hover:border-primary/50 bg-card/50";
                if (isAnswered) {
                  if (idx === currentQ.correctAnswer) optionStyle = "border-primary bg-primary/20 text-primary font-bold";
                  else if (idx === answers[currentIndex] && !isCorrect) optionStyle = "border-destructive bg-destructive/20 text-destructive";
                  else optionStyle = "opacity-50 border-border bg-card/50";
                } else if (selectedOption === idx) {
                  optionStyle = "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2 ring-offset-background";
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionSelect(idx)}
                    className={cn(
                      "w-full text-left p-5 rounded-xl border-2 transition-all flex items-center justify-between group",
                      optionStyle
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full border border-current flex items-center justify-center text-sm font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-lg">{option}</span>
                    </div>
                    {isAnswered && idx === currentQ.correctAnswer && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-border">
              <Button variant="ghost" onClick={handlePrev} disabled={currentIndex === 0}>
                <ChevronLeft className="mr-2 w-4 h-4" /> Previous Item
              </Button>
              
              {!isAnswered ? (
                <Button 
                  onClick={handleSubmitItem} 
                  disabled={selectedOption === null}
                  className="bg-primary hover:bg-primary/90 text-white px-8"
                >
                  Confirm Choice
                </Button>
              ) : (
                <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-white px-8">
                  {currentIndex === questions.length - 1 ? "Finish Gauntlet" : "Next Item"} <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-1 px-6 bg-card border-t border-border">
          <Progress value={(Object.keys(answers).length / questions.length) * 100} className="h-1" />
        </div>
      </main>
    </div>
  );
}

function CelebrationScreen({ score, total, onBack }: { score: number, total: number, onBack: () => void }) {
  const isPass = score >= 75;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {isPass && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i} 
              className="confetti-piece" 
              style={{ 
                left: `${Math.random() * 100}%`, 
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: i % 2 === 0 ? '#26A95A' : '#B0E0B0'
              }} 
            />
          ))}
        </div>
      )}
      
      <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <Award className={cn("w-32 h-32 mx-auto", isPass ? "text-primary" : "text-muted-foreground")} />
          {isPass && (
            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-primary font-bold px-4 py-1 text-lg whitespace-nowrap">
              FUTURE RMT
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-4xl font-headline font-bold">{isPass ? "CONGRATULATIONS!" : "KEEP STUDYING!"}</h2>
          <p className="text-muted-foreground text-lg">
            You achieved a score of <span className="text-primary font-bold">{score}/{total}</span>
          </p>
        </div>

        <div className="grid gap-4">
          <Button onClick={onBack} className="w-full bg-primary hover:bg-primary/90 h-12 text-lg">Return to Dashboard</Button>
          <Button variant="outline" onClick={() => window.location.reload()} className="w-full h-12 border-primary text-primary">Retake Assessment</Button>
        </div>
      </div>
    </div>
  );
}