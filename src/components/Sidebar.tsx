"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, LogOut, CheckSquare, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useTodo } from "@/context/TodoContext";
import { useRouter } from "next/navigation";
import gsap from "gsap";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { isAddModalOpen, setAddModalOpen } = useTodo();
  const router = useRouter();

  // GSAP Animation for Mobile Nav
  React.useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".mobile-nav-item", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.2
      });
    });
    return () => ctx.revert();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-gray-100 p-6 flex-col z-40">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
            <CheckSquare className="text-primary" size={28} />
            WellPath
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="px-4 py-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email}
            </p>
            <p className="text-xs text-gray-500">Signed in</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom overflow-visible">
        {/* Glass Background */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-t border-white/40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" />
        
        <div className="relative flex items-center justify-around px-6 py-2 h-20">
          {/* Dashboard Link */}
          <Link
            href="/dashboard"
            className="mobile-nav-item flex flex-col items-center gap-1 p-2 relative group"
          >
            <div className={cn(
              "p-2 rounded-xl transition-all duration-300",
              pathname === "/dashboard" ? "bg-primary/10 text-primary" : "text-gray-400"
            )}>
              <Home size={24} strokeWidth={pathname === "/dashboard" ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[10px] font-medium transition-colors duration-300",
              pathname === "/dashboard" ? "text-primary" : "text-gray-400"
            )}>
              Home
            </span>
          </Link>

          {/* Add Button - Centered & Floating */}
          <div className="relative -top-6">
            <button
              onClick={() => setAddModalOpen(!isAddModalOpen)}
              className="mobile-add-btn w-16 h-16 bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/40 text-white border-4 border-background transition-transform active:scale-95"
            >
              <Plus 
                size={32} 
                strokeWidth={3} 
                className={cn(
                  "transition-transform duration-300",
                  isAddModalOpen ? "rotate-45" : "rotate-0"
                )} 
              />
            </button>
          </div>

          {/* Profile Link */}
          <Link
            href="/profile"
            className="mobile-nav-item flex flex-col items-center gap-1 p-2 relative group"
          >
            <div className={cn(
              "p-2 rounded-xl transition-all duration-300",
              pathname === "/profile" ? "bg-primary/10 text-primary" : "text-gray-400"
            )}>
              <User size={24} strokeWidth={pathname === "/profile" ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[10px] font-medium transition-colors duration-300",
              pathname === "/profile" ? "text-primary" : "text-gray-400"
            )}>
              Profile
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
