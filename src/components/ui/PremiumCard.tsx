import type { ReactNode } from "react";

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
}

export function PremiumCard({ children, className = "" }: PremiumCardProps) {
  return (
    <section className={`glow-card rounded-2xl ${className}`}>
      {children}
    </section>
  );
}
