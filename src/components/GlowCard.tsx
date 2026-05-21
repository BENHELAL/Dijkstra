import type { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

export function GlowCard({ children, className = "" }: GlowCardProps) {
  return <div className={`glow-card rounded-2xl ${className}`}>{children}</div>;
}
