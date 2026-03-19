"use client"

import { cn } from "@/lib/utils";

export function SynapseLogo({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full heartbeat text-primary"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M30 20V80L70 20V80" 
          stroke="currentColor" 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <circle cx="50" cy="50" r="12" fill="currentColor" className="opacity-50" />
      </svg>
      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full -z-10 animate-pulse" />
    </div>
  );
}