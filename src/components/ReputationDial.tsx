"use client";

import React from "react";

interface ReputationDialProps {
  score: number;
  size?: number;
}

/**
 * Suggestion #7: Interactive Vouch "Seeds" / Integrity Dial
 * A premium SVG dial that visualizes reputation progress.
 */
export function ReputationDial({ score, size = 80 }: ReputationDialProps) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score / 1000, 1); // Cap at 1000 for full circle
  const offset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-stone-100"
        />
        {/* Progress Fill (Iridescent/Gold) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#goldGradient)"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CA8A04" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
        </defs>
      </svg>
      {/* Suggestion #2: Fira Code for numeric data */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono font-bold text-lg text-primary tracking-tighter">
          {score}
        </span>
        <span className="text-[8px] uppercase font-bold text-accent tracking-widest">
          Vouches
        </span>
      </div>
    </div>
  );
}
