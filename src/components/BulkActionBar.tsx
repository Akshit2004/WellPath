"use client";

import React from "react";
import { useTodo } from "@/context/TodoContext";
import { CheckCircle2, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BulkActionBar() {
  const { selectedTodos, clearSelection, bulkComplete, bulkDelete } = useTodo();

  if (selectedTodos.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
          <span className="text-sm font-medium text-primary">
            {selectedTodos.length} selected
          </span>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <button
          onClick={bulkComplete}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
            "bg-green-50 text-green-600 hover:bg-green-100 border border-green-100"
          )}
        >
          <CheckCircle2 size={18} />
          <span className="hidden sm:inline">Complete All</span>
        </button>

        <button
          onClick={bulkDelete}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
            "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
          )}
        >
          <Trash2 size={18} />
          <span className="hidden sm:inline">Delete All</span>
        </button>

        <button
          onClick={clearSelection}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          title="Clear selection"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
