"use client"

import { cn } from "@/lib/utils";

export function SynapseLogo({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full synapse-pulse"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M20 20L50 50L80 20M20 80L50 50L80 80" 
          stroke="currentColor" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <circle cx="50" cy="50" r="10" fill="currentColor" />
        <path 
          d="M50 10V30M50 70V90M10 50H30M70 50H90" 
          stroke="currentColor" 
          strokeWidth="4" 
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10 animate-pulse" />
    </div>
  );
}