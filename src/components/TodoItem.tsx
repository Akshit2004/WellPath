import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check, Trash2, Calendar, Square, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Todo, useTodo } from "@/context/TodoContext";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const { setViewingTask, isSelectionMode, selectedTodos, toggleSelection } = useTodo();
  const itemRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const isSelected = selectedTodos.includes(todo.id);

  // Animation for completion toggle
  useGSAP(
    () => {
      if (todo.completed) {
        gsap.to(textRef.current, {
          color: "#9ca3af", // text-gray-400
          textDecoration: "line-through",
          duration: 0.3,
        });
        gsap.to(itemRef.current, {
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          duration: 0.3,
        });
      } else {
        gsap.to(textRef.current, {
          color: "var(--foreground)",
          textDecoration: "none",
          duration: 0.3,
        });
        gsap.to(itemRef.current, {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          duration: 0.3,
        });
      }
    },
    { scope: itemRef, dependencies: [todo.completed] }
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    gsap.to(itemRef.current, {
      x: 100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => onDelete(todo.id),
    });
  };

  const handleItemClick = () => {
    if (isSelectionMode) {
      toggleSelection(todo.id);
    } else {
      setViewingTask(todo);
    }
  };

  const priorityColors = {
    high: "bg-red-100 text-red-600 border-red-200",
    medium: "bg-yellow-100 text-yellow-600 border-yellow-200",
    low: "bg-blue-100 text-blue-600 border-blue-200",
  };

  return (
    <div
      ref={itemRef}
      onClick={handleItemClick}
      className={cn(
        "group flex items-center justify-between p-4 mb-3 rounded-xl cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]",
        "bg-white/80 border border-gray-100 shadow-sm backdrop-blur-sm",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}
    >
      <div className="flex items-center gap-4 overflow-hidden flex-1">
        {isSelectionMode ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleSelection(todo.id);
            }}
            className="flex-shrink-0 cursor-pointer"
          >
            {isSelected ? (
              <CheckSquare size={22} className="text-primary" />
            ) : (
              <Square size={22} className="text-gray-300" />
            )}
          </div>
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggle(todo.id);
            }}
            className={cn(
              "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 cursor-pointer",
              todo.completed
                ? "bg-green-500 border-green-500"
                : "border-gray-300 group-hover:border-primary"
            )}
          >
            {todo.completed && <Check size={14} className="text-white" />}
          </div>
        )}
        
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span ref={textRef} className="text-lg font-medium truncate select-none">
              {todo.text}
            </span>
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider", priorityColors[todo.priority])}>
              {todo.priority}
            </span>
          </div>
          
          {todo.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={12} />
              <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDelete}
          className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
