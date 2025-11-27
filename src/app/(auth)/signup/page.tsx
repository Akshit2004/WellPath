"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const visualsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { signUp, signInWithGoogle, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  useGSAP(
    () => {
      if (authLoading || user) return;

      // Visuals Animation (Left Side)
      const orbs = visualsRef.current?.querySelectorAll(".orb");
      if (orbs) {
        gsap.to(orbs, {
          y: "random(-50, 50)",
          x: "random(-50, 50)",
          scale: "random(0.8, 1.2)",
          duration: "random(3, 5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: {
            amount: 2,
            from: "random",
          },
        });
      }

      // Form Entrance Animation (Right Side)
      const formElements = formRef.current?.querySelectorAll(".animate-item");
      if (formElements) {
        gsap.fromTo(
          formElements,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      }
    },
    { scope: containerRef, dependencies: [authLoading, user] }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signUp(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      setIsLoading(false);

      // Error Shake Animation
      gsap.fromTo(
        formRef.current,
        { x: 0 },
        {
          x: 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.to(formRef.current, { x: 0, duration: 0.1 });
          },
        }
      );
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full flex flex-col md:flex-row bg-background overflow-hidden"
    >
      {/* Left Side - Visual Experience */}
      <div
        ref={visualsRef}
        className="relative hidden md:flex w-full md:w-1/2 bg-black items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-black z-10" />
        
        {/* Animated Orbs */}
        <div className="orb absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/30 blur-[80px]" />
        <div className="orb absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-[100px]" />
        <div className="orb absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-pink-500/20 blur-[60px]" />

        <div className="relative z-20 p-12 text-white max-w-lg">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">WellPath</span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Start your journey today. Create an account to track your habits, set goals, and unlock your full potential.
          </p>
        </div>
      </div>

      {/* Right Side - Interaction */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left animate-item">
            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="text-muted-foreground mt-2">
              Join us and start organizing your life
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="animate-item">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 h-12 bg-secondary/50 border-transparent focus:border-primary transition-all duration-300"
                />
              </div>
              <div className="animate-item">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="•••••••• (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-2 h-12 bg-secondary/50 border-transparent focus:border-primary transition-all duration-300"
                />
              </div>
            </div>

            {error && (
              <div className="animate-item p-3 rounded-md bg-red-500/10 text-red-500 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div className="animate-item pt-2">
              <Button
                className="w-full h-12 text-base font-medium shadow-lg hover:shadow-primary/25 transition-all duration-300"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>

            <div className="animate-item relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="animate-item">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-border hover:bg-secondary/50 transition-all duration-300"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
            </div>

            <div className="animate-item text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 transition-colors font-medium underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
