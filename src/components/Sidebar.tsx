"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, LogOut, CheckSquare, Plus, X, StickyNote } from "lucide-react";
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
    { href: "/notes", icon: StickyNote, label: "Notes" },
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
          {user ? (
            <>
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.email}
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
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary hover:bg-primary/5 transition-all w-full"
            >
              <LogOut size={20} className="rotate-180" />
              <span className="font-medium">Sign In</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 flex justify-center safe-area-inset-bottom pointer-events-none">
        <nav className="w-full max-w-sm bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl shadow-primary/5 rounded-2xl pointer-events-auto overflow-hidden">
          <div className="flex items-center justify-between px-2 py-2">
            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className="flex-1 flex flex-col items-center gap-1 py-2 relative group"
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                pathname === "/dashboard" 
                  ? "bg-primary text-white shadow-lg shadow-primary/25 translate-y-[-2px]" 
                  : "text-gray-400 hover:bg-gray-50"
              )}>
                <Home size={20} strokeWidth={pathname === "/dashboard" ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-300 absolute -bottom-1",
                pathname === "/dashboard" 
                  ? "opacity-100 translate-y-0 text-primary" 
                  : "opacity-0 translate-y-2 text-gray-400"
              )}>
                Home
              </span>
            </Link>

            {/* Notes Link */}
            <Link
              href="/notes"
              className="flex-1 flex flex-col items-center gap-1 py-2 relative group"
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                pathname === "/notes" 
                  ? "bg-primary text-white shadow-lg shadow-primary/25 translate-y-[-2px]" 
                  : "text-gray-400 hover:bg-gray-50"
              )}>
                <StickyNote size={20} strokeWidth={pathname === "/notes" ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-300 absolute -bottom-1",
                pathname === "/notes" 
                  ? "opacity-100 translate-y-0 text-primary" 
                  : "opacity-0 translate-y-2 text-gray-400"
              )}>
                Notes
              </span>
            </Link>

            {/* Add Button */}
            <button
              onClick={() => setAddModalOpen(!isAddModalOpen)}
              className="flex-1 flex flex-col items-center gap-1 py-2 relative group"
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isAddModalOpen 
                  ? "bg-primary text-white shadow-lg shadow-primary/25 translate-y-[-2px]" 
                  : "text-gray-400 hover:bg-gray-50"
              )}>
                <Plus 
                  size={20} 
                  strokeWidth={isAddModalOpen ? 2.5 : 2}
                  className={cn(
                    "transition-transform duration-300",
                    isAddModalOpen ? "rotate-45" : "rotate-0"
                  )} 
                />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-300 absolute -bottom-1",
                isAddModalOpen 
                  ? "opacity-100 translate-y-0 text-primary" 
                  : "opacity-0 translate-y-2 text-gray-400"
              )}>
                Add
              </span>
            </button>

            {/* Profile Link */}
            <Link
              href="/profile"
              className="flex-1 flex flex-col items-center gap-1 py-2 relative group"
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                pathname === "/profile" 
                  ? "bg-primary text-white shadow-lg shadow-primary/25 translate-y-[-2px]" 
                  : "text-gray-400 hover:bg-gray-50"
              )}>
                <User size={20} strokeWidth={pathname === "/profile" ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-300 absolute -bottom-1",
                pathname === "/profile" 
                  ? "opacity-100 translate-y-0 text-primary" 
                  : "opacity-0 translate-y-2 text-gray-400"
              )}>
                Profile
              </span>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
