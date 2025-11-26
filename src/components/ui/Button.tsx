"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    const variants = {
      primary:
        "bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/25",
      secondary:
        "bg-white/10 text-white hover:bg-white/20 border border-white/10",
      ghost: "hover:bg-white/5 text-white",
    };

    const sizes = {
      default: "h-12 px-6 py-3",
      sm: "h-9 px-3",
      lg: "h-14 px-8",
      icon: "h-12 w-12 p-0",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
