"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import TodoList from "@/components/TodoList";
import AddTodo from "@/components/AddTodo";
import StatsCard from "@/components/StatsCard";
import TaskDetailModal from "@/components/TaskDetailModal";
import BulkActionBar from "@/components/BulkActionBar";
import { useTodo } from "@/context/TodoContext";
import { Target, CheckCircle2, TrendingUp, Calendar, Flame } from "lucide-react";

export default function Home() {
  const { todos, loading } = useTodo();
  
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.filter((t) => !t.completed).length;
  const completionRate = todos.length > 0 
    ? Math.round((completedCount / todos.length) * 100)
    : 0;
  
  const today = new Date().setHours(0, 0, 0, 0);
  const completedToday = todos.filter((t) => 
    t.completed && new Date(t.createdAt).setHours(0, 0, 0, 0) === today
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background pb-20 md:pb-0">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600">Welcome back! Here's your productivity overview.</p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <StatsCard
              title="Total Tasks"
              value={todos.length}
              icon={Target}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
            <StatsCard
              title="Completed"
              value={completedCount}
              icon={CheckCircle2}
              iconColor="text-green-600"
              iconBg="bg-green-50"
            />
            <StatsCard
              title="Active"
              value={activeCount}
              icon={Calendar}
              iconColor="text-yellow-600"
              iconBg="bg-yellow-50"
            />
            <StatsCard
              title="Success Rate"
              value={`${completionRate}%`}
              icon={TrendingUp}
              iconColor="text-purple-600"
              iconBg="bg-purple-50"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Todo List - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Your Tasks</h2>
                  <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
                <TodoList />
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              {/* Today's Progress */}
              <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Flame size={24} />
                  <h3 className="text-lg font-bold">Today's Progress</h3>
                </div>
                <p className="text-4xl font-bold mb-2">{completedToday}</p>
                <p className="text-white/80">Tasks completed today</p>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">High Priority</span>
                    <span className="font-bold text-red-600">
                      {todos.filter((t) => t.priority === "high" && !t.completed).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Medium Priority</span>
                    <span className="font-bold text-yellow-600">
                      {todos.filter((t) => t.priority === "medium" && !t.completed).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Low Priority</span>
                    <span className="font-bold text-blue-600">
                      {todos.filter((t) => t.priority === "low" && !t.completed).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Upcoming</h3>
                <div className="space-y-2">
                  {todos
                    .filter((t) => !t.completed && t.dueDate)
                    .sort((a, b) => (a.dueDate || 0) - (b.dueDate || 0))
                    .slice(0, 3)
                    .map((todo) => (
                      <div key={todo.id} className="text-sm">
                        <p className="font-medium truncate">{todo.text}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(todo.dueDate!).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  {todos.filter((t) => !t.completed && t.dueDate).length === 0 && (
                    <p className="text-gray-500 text-sm">No upcoming deadlines</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddTodo />
      <TaskDetailModal />
      <BulkActionBar />
    </div>
  );
}
