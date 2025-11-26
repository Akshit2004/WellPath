"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { todoService } from "@/lib/firestoreService";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: "high" | "medium" | "low";
  dueDate: number | null;
  order: number;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string, priority: Todo["priority"], dueDate: number | null) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  clearCompleted: () => Promise<void>;
  loading: boolean;
  isAddModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  viewingTask: Todo | null;
  setViewingTask: (task: Todo | null) => void;
  selectedTodos: string[];
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  bulkComplete: () => Promise<void>;
  bulkDelete: () => Promise<void>;
  reorderTodos: (todos: Todo[]) => Promise<void>;
  isSelectionMode: boolean;
  setSelectionMode: (mode: boolean) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [viewingTask, setViewingTask] = useState<Todo | null>(null);
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const [isSelectionMode, setSelectionMode] = useState(false);
  const { user } = useAuth();

  // Subscribe to Firestore updates
  useEffect(() => {
    if (!user) {
      if (todos.length > 0) setTodos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = todoService.subscribeTodos(user.uid, (updatedTodos) => {
      // Sort by order field
      const sortedTodos = updatedTodos.sort((a, b) => a.order - b.order);
      setTodos(sortedTodos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTodo = async (text: string, priority: Todo["priority"] = "medium", dueDate: number | null = null) => {
    if (!user) return;
    
    const maxOrder = todos.length > 0 ? Math.max(...todos.map(t => t.order)) : -1;
    const newTodo: Omit<Todo, "id"> = {
      text,
      completed: false,
      createdAt: Date.now(),
      priority,
      dueDate,
      order: maxOrder + 1,
    };
    
    await todoService.addTodo(user.uid, newTodo);
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    
    await todoService.updateTodo(id, { completed: !todo.completed });
  };

  const deleteTodo = async (id: string) => {
    await todoService.deleteTodo(id);
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    await todoService.updateTodo(id, updates);
  };

  const clearCompleted = async () => {
    if (!user) return;
    
    const completedIds = todos.filter((t) => t.completed).map((t) => t.id);
    await todoService.clearCompleted(user.uid, completedIds);
  };

  const toggleSelection = (id: string) => {
    setSelectedTodos(prev => 
      prev.includes(id) ? prev.filter(todoId => todoId !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedTodos([]);
    setSelectionMode(false);
  };

  const bulkComplete = async () => {
    const updates = selectedTodos.map(id => todoService.updateTodo(id, { completed: true }));
    await Promise.all(updates);
    clearSelection();
  };

  const bulkDelete = async () => {
    const deletes = selectedTodos.map(id => todoService.deleteTodo(id));
    await Promise.all(deletes);
    clearSelection();
  };

  const reorderTodos = async (reorderedTodos: Todo[]) => {
    // Update local state immediately for smooth UX
    setTodos(reorderedTodos);
    
    // Update order in Firestore
    const updates = reorderedTodos.map((todo, index) => 
      todoService.updateTodo(todo.id, { order: index })
    );
    await Promise.all(updates);
  };

  return (
    <TodoContext.Provider
      value={{ 
        todos, 
        addTodo, 
        toggleTodo, 
        deleteTodo, 
        updateTodo, 
        clearCompleted, 
        loading,
        isAddModalOpen,
        setAddModalOpen,
        viewingTask,
        setViewingTask,
        selectedTodos,
        toggleSelection,
        clearSelection,
        bulkComplete,
        bulkDelete,
        reorderTodos,
        isSelectionMode,
        setSelectionMode
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
}
