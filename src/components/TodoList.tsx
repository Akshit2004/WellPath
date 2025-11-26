"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTodo } from "@/context/TodoContext";
import TodoItem from "./TodoItem";
import { cn } from "@/lib/utils";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckSquare } from "lucide-react";

// Sortable wrapper for TodoItem
function SortableTodoItem({ todo, onToggle, onDelete }: { todo: any; onToggle: any; onDelete: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id });
  const { isSelectionMode } = useTodo();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...(!isSelectionMode ? listeners : {})}>
      <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
    </div>
  );
}

export default function TodoList() {
  const { todos, toggleTodo, deleteTodo, reorderTodos, isSelectionMode, setSelectionMode } = useTodo();
  const listRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms press before drag starts
        tolerance: 5, // 5px of movement allowed during the delay
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // Stagger animation for initial load and new items
  useGSAP(
    () => {
      if (!listRef.current) return;
      
      gsap.fromTo(
        listRef.current.children,
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    },
    { scope: listRef, dependencies: [todos.length, filter] }
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredTodos.findIndex((todo) => todo.id === active.id);
      const newIndex = filteredTodos.findIndex((todo) => todo.id === over.id);

      const reordered = arrayMove(filteredTodos, oldIndex, newIndex);
      reorderTodos(reordered);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-24">
      <div className="flex justify-between items-center gap-2 mb-6">
        <div className="flex gap-2">
          {(["all", "active", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all capitalize",
                filter === f
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-white/50 text-muted-foreground hover:bg-white/80"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setSelectionMode(!isSelectionMode)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
            isSelectionMode
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "bg-white/50 text-muted-foreground hover:bg-white/80"
          )}
        >
          <CheckSquare size={16} />
          <span className="hidden sm:inline">{isSelectionMode ? "Cancel" : "Select"}</span>
        </button>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-xl">No tasks found.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div ref={listRef}>
              {filteredTodos.map((todo) => (
                <SortableTodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
