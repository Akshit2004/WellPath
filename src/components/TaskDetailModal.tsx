"use client";

import React, { useRef, useState, useEffect } from "react";
import { useTodo } from "@/context/TodoContext";
import { X, Calendar, Clock, AlertCircle, CheckCircle2, Circle, Edit2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Input } from "./ui/Input";

export default function TaskDetailModal() {
  const { viewingTask, setViewingTask, toggleTodo, deleteTodo, updateTodo } = useTodo();
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");

  // Reset editing state when task changes
  useEffect(() => {
    if (viewingTask) {
      setEditText(viewingTask.text);
      setIsEditing(false);
    }
  }, [viewingTask]);

  // Animate modal open/close
  useGSAP(() => {
    if (viewingTask) {
      gsap.to(modalRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.3 });
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    } else if (modalRef.current) {
      gsap.to(modalRef.current, { opacity: 0, pointerEvents: "none", duration: 0.3 });
    }
  }, { dependencies: [viewingTask] });

  if (!viewingTask) return null;

  const priorityColors = {
    high: "text-red-600 bg-red-50 border-red-100",
    medium: "text-yellow-600 bg-yellow-50 border-yellow-100",
    low: "text-blue-600 bg-blue-50 border-blue-100",
  };

  const handleDelete = async () => {
    await deleteTodo(viewingTask.id);
    setViewingTask(null);
  };

  const handleToggle = async () => {
    const wasCompleted = viewingTask.completed;
    await toggleTodo(viewingTask.id);
    if (!wasCompleted) {
      setViewingTask(null);
    }
  };

  const handleSave = async () => {
    if (editText.trim() && editText !== viewingTask.text) {
      await updateTodo(viewingTask.id, { text: editText });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(viewingTask.text);
    setIsEditing(false);
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm opacity-0 pointer-events-none"
      onClick={(e) => {
        if (e.target === modalRef.current) setViewingTask(null);
      }}
    >
      <div
        ref={contentRef}
        className="w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium border uppercase tracking-wider",
                priorityColors[viewingTask.priority]
              )}
            >
              {viewingTask.priority}
            </span>
            {viewingTask.completed && (
              <span className="px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-green-50 text-green-600 border border-green-100 flex items-center gap-1">
                <CheckCircle2 size={12} /> Done
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary"
                title="Edit task"
              >
                <Edit2 size={18} />
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 hover:bg-green-50 rounded-full transition-colors text-green-600"
                  title="Save changes"
                >
                  <Save size={18} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-600"
                  title="Cancel editing"
                >
                  <X size={18} />
                </button>
              </>
            )}
            {!isEditing && (
              <button
                onClick={() => setViewingTask(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                title="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            {isEditing ? (
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="text-lg sm:text-2xl font-bold mb-2 h-auto py-2"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave();
                  } else if (e.key === "Escape") {
                    handleCancelEdit();
                  }
                }}
              />
            ) : (
              <h2
                className={cn(
                  "text-xl sm:text-2xl font-bold leading-tight mb-2",
                  viewingTask.completed && "text-gray-400 line-through decoration-gray-300"
                )}
              >
                {viewingTask.text}
              </h2>
            )}
            <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-2">
              <Clock size={14} />
              <span className="truncate">
                Created {new Date(viewingTask.createdAt).toLocaleDateString()} at {new Date(viewingTask.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

            <div className={cn(
              "p-3 sm:p-4 rounded-2xl border transition-colors",
              !viewingTask.completed && viewingTask.dueDate && viewingTask.dueDate < Date.now()
                ? "bg-red-50 border-red-100"
                : "bg-gray-50 border-gray-100"
            )}>
              <div className={cn(
                "flex items-center gap-2 mb-1",
                !viewingTask.completed && viewingTask.dueDate && viewingTask.dueDate < Date.now()
                  ? "text-red-600"
                  : "text-gray-500"
              )}>
                <Calendar size={14} className="sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Due Date</span>
              </div>
              <p className={cn(
                "font-medium text-sm sm:text-base",
                !viewingTask.completed && viewingTask.dueDate && viewingTask.dueDate < Date.now()
                  ? "text-red-700"
                  : "text-gray-900"
              )}>
                {viewingTask.dueDate
                  ? new Date(viewingTask.dueDate).toLocaleDateString(undefined, { 
                      weekday: "short", 
                      year: "numeric", 
                      month: "short", 
                      day: "numeric" 
                    })
                  : "No deadline"}
              </p>
            </div>
            <div className={cn(
              "p-3 sm:p-4 rounded-2xl border transition-colors",
              !viewingTask.completed && viewingTask.dueDate && viewingTask.dueDate < Date.now()
                ? "bg-red-50 border-red-100"
                : "bg-gray-50 border-gray-100"
            )}>
              <div className={cn(
                "flex items-center gap-2 mb-1",
                !viewingTask.completed && viewingTask.dueDate && viewingTask.dueDate < Date.now()
                  ? "text-red-600"
                  : "text-gray-500"
              )}>
                <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Status</span>
              </div>
              <p className={cn(
                "font-medium text-sm sm:text-base", 
                viewingTask.completed 
                  ? "text-green-600" 
                  : viewingTask.dueDate && viewingTask.dueDate < Date.now()
                    ? "text-red-600"
                    : "text-yellow-600"
              )}>
                {viewingTask.completed 
                  ? "Completed" 
                  : viewingTask.dueDate && viewingTask.dueDate < Date.now()
                    ? "Overdue"
                    : "In Progress"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-gray-50/50 border-t border-gray-100 flex gap-2 sm:gap-3">
          <button
            onClick={handleToggle}
            className={cn(
              "flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium flex items-center justify-center gap-1.5 sm:gap-2 transition-all text-sm sm:text-base",
              viewingTask.completed
                ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                : "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
            )}
          >
            {viewingTask.completed ? (
              <>
                <Circle size={16} className="sm:w-[18px] sm:h-[18px]" /> 
                <span className="hidden sm:inline">Mark as Incomplete</span>
                <span className="sm:hidden">Incomplete</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" /> 
                <span className="hidden sm:inline">Mark as Complete</span>
                <span className="sm:hidden">Complete</span>
              </>
            )}
          </button>
          <button
            onClick={handleDelete}
            className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
