
"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function QuizRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirecting to dashboard as quizzes should be selected via subjecthub
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );
}
