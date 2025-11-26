"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
        .from(
          ".feature-item",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .from(
          ctaRef.current,
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        );

      // Floating animation for background elements
      gsap.to(".floating-shape", {
        y: -20,
        rotation: 10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 2,
          from: "random",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden p-6"
    >
      {/* Background Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] floating-shape" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/20 rounded-full blur-[120px] floating-shape" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] -z-10" />

      <main className="max-w-4xl mx-auto text-center z-10">
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-medium text-muted-foreground feature-item">
          <Sparkles size={16} className="text-yellow-400" />
          <span>The most creative way to get things done</span>
        </div>

        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold mb-8 tracking-tight"
        >
          Manage tasks with <br />
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Style & Motion
          </span>
        </h1>

        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto feature-item">
          Experience a todo list that feels alive. Smooth animations, vibrant
          colors, and a satisfying way to check off your goals.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 feature-item">
          <div className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="text-green-500" />
            <span>Smart Organization</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="text-primary" />
            <span>Fluid Animations</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="text-secondary" />
            <span>Beautiful Design</span>
          </div>
        </div>

        <div ref={ctaRef}>
          <Link href="/login">
            <Button size="lg" className="text-lg px-10 h-16 rounded-2xl group">
              Get Started
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-6 text-sm text-muted-foreground opacity-60">
        Built with Next.js, Tailwind & GSAP
      </footer>
    </div>
  );
}
