"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const circle1Ref = useRef<HTMLDivElement>(null);
  const circle2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Floating animation for background circles
      gsap.to(circle1Ref.current, {
        x: 100,
        y: -50,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(circle2Ref.current, {
        x: -80,
        y: 60,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Entrance animation for the card
      gsap.fromTo(
        cardRef.current,
        {
          y: 50,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div
        ref={circle1Ref}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px] pointer-events-none"
      />
      <div
        ref={circle2Ref}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/20 blur-[120px] pointer-events-none"
      />

      {/* Glassmorphism Card */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
