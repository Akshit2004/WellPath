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

  // Subscribe to Firestore updates or use Local Storage
  useEffect(() => {
    if (!user) {
      // Load from local storage
      const savedTodos = localStorage.getItem("local_todos");
      if (savedTodos) {
        try {
          setTodos(JSON.parse(savedTodos));
        } catch (e) {
          console.error("Failed to parse local todos", e);
          setTodos([]);
        }
      } else {
        setTodos([]);
      }
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

  // Helper to save to local storage
  const saveToLocalStorage = (newTodos: Todo[]) => {
    localStorage.setItem("local_todos", JSON.stringify(newTodos));
    setTodos(newTodos);
  };

  const addTodo = async (text: string, priority: Todo["priority"] = "medium", dueDate: number | null = null) => {
    const maxOrder = todos.length > 0 ? Math.max(...todos.map(t => t.order)) : -1;
    const newTodoData = {
      text,
      completed: false,
      createdAt: Date.now(),
      priority,
      dueDate,
      order: maxOrder + 1,
    };

    if (!user) {
      const newTodo: Todo = {
        ...newTodoData,
        id: Date.now().toString(), // Simple ID for local todos
      };
      saveToLocalStorage([...todos, newTodo]);
      return;
    }
    
    await todoService.addTodo(user.uid, newTodoData);
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    
    if (!user) {
      const updatedTodos = todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      saveToLocalStorage(updatedTodos);
      return;
    }

    await todoService.updateTodo(id, { completed: !todo.completed });
  };

  const deleteTodo = async (id: string) => {
    if (!user) {
      const updatedTodos = todos.filter(t => t.id !== id);
      saveToLocalStorage(updatedTodos);
      return;
    }
    await todoService.deleteTodo(id);
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    if (!user) {
      const updatedTodos = todos.map(t => 
        t.id === id ? { ...t, ...updates } : t
      );
      saveToLocalStorage(updatedTodos);
      return;
    }
    await todoService.updateTodo(id, updates);
  };

  const clearCompleted = async () => {
    if (!user) {
      const updatedTodos = todos.filter(t => !t.completed);
      saveToLocalStorage(updatedTodos);
      return;
    }
    
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
    if (!user) {
      const updatedTodos = todos.map(t => 
        selectedTodos.includes(t.id) ? { ...t, completed: true } : t
      );
      saveToLocalStorage(updatedTodos);
      clearSelection();
      return;
    }

    const updates = selectedTodos.map(id => todoService.updateTodo(id, { completed: true }));
    await Promise.all(updates);
    clearSelection();
  };

  const bulkDelete = async () => {
    if (!user) {
      const updatedTodos = todos.filter(t => !selectedTodos.includes(t.id));
      saveToLocalStorage(updatedTodos);
      clearSelection();
      return;
    }

    const deletes = selectedTodos.map(id => todoService.deleteTodo(id));
    await Promise.all(deletes);
    clearSelection();
  };

  const reorderTodos = async (reorderedTodos: Todo[]) => {
    // Update local state immediately for smooth UX
    setTodos(reorderedTodos);
    
    if (!user) {
      // Update order in local storage
      const updatedTodos = reorderedTodos.map((todo, index) => ({ ...todo, order: index }));
      saveToLocalStorage(updatedTodos);
      return;
    }

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
