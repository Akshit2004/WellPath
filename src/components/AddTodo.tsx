"use client";

import React, { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTodo } from "@/context/TodoContext";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export default function AddTodo() {
  const { addTodo, isAddModalOpen, setAddModalOpen } = useTodo();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [date, setDate] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const dueDate = date ? new Date(date).getTime() : null;
      addTodo(text.trim(), priority, dueDate);
      setText("");
      setPriority("medium");
      setDate("");
      setAddModalOpen(false); // Close on submit
    }
  };

  useGSAP(
    () => {
      if (isAddModalOpen) {
        gsap.to(".add-form", {
          height: "auto",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(".fab-icon", {
          rotation: 45,
          duration: 0.3,
        });
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        gsap.to(".add-form", {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
        gsap.to(".fab-icon", {
          rotation: 0,
          duration: 0.3,
        });
      }
    },
    { scope: containerRef, dependencies: [isAddModalOpen] }
  );

  return (
    <div
      ref={containerRef}
      className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50"
    >
      <form
        onSubmit={handleSubmit}
        className="add-form h-0 opacity-0 overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl mb-4 shadow-2xl"
      >
        <div className="p-4 space-y-4">
          <Input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="bg-transparent border-none focus-visible:ring-0 text-lg placeholder:text-gray-400 p-0"
          />
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="bg-white/50 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white/50 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <Button type="submit" size="sm" className="shrink-0">
              Add Task
            </Button>
          </div>
        </div>
      </form>

      <button
        onClick={() => setAddModalOpen(!isAddModalOpen)}
        className="hidden md:flex w-16 h-16 mx-auto bg-gradient-to-r from-primary to-accent rounded-full items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-transform duration-300"
      >
        <Plus size={32} className="text-white fab-icon" />
      </button>
    </div>
  );
}
