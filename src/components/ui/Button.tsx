import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

const variants = {
  primary: "control-button control-button-primary",
  secondary: "control-button",
  ghost: "rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-slate-950"
};

export function Button({ children, variant = "secondary", className = "", ...props }: ButtonProps) {
  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
