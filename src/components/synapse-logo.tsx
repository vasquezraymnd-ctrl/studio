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
        {/* Medical 'N' Design */}
        <path 
          d="M30 80V20L70 80V20" 
          stroke="currentColor" 
          strokeWidth="12" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        {/* Pulse Circle in the center */}
        <circle cx="50" cy="50" r="10" fill="currentColor" className="opacity-30" />
      </svg>
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10 animate-pulse" />
    </div>
  );
}