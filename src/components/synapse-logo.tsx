
"use client"

import { cn } from "@/lib/utils";

export function SynapseLogo({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full text-primary animate-in fade-in duration-1000 filter drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Syringe Body/Barrel */}
        <path 
          d="M35 30 L65 30 L65 70 L50 85 L35 70 Z" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        {/* Plunger */}
        <path 
          d="M50 30 L50 15 M40 15 L60 15" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeLinecap="round"
        />
        {/* Needle */}
        <path 
          d="M50 85 L50 95" 
          stroke="currentColor" 
          strokeWidth="4" 
          strokeLinecap="round"
        />
        {/* Pulse Dot at the needle tip/base */}
        <circle 
          cx="50" 
          cy="85" 
          r="6" 
          fill="currentColor" 
          className="heartbeat shadow-lg shadow-primary/50" 
        />
        
        {/* Measurement Marks */}
        <line x1="42" y1="40" x2="50" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="50" x2="50" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="60" x2="50" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full -z-10 animate-pulse" />
    </div>
  );
}
