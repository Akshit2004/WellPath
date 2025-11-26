"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useTodo } from "@/context/TodoContext";
import Sidebar from "@/components/Sidebar";
import { Calendar, CheckCircle2, Target, TrendingUp } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { todos } = useTodo();

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    active: todos.filter((t) => !t.completed).length,
    completionRate: todos.length > 0 
      ? Math.round((todos.filter((t) => t.completed).length / todos.length) * 100)
      : 0,
  };

  return (
    <div className="flex min-h-screen bg-background pb-20 md:pb-0">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Profile</h1>

          {/* User Info Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-100 shadow-sm mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.displayName || "User"}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Member since {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Target className="text-blue-600" size={20} />
                </div>
                <span className="text-sm text-gray-600">Total Tasks</span>
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle2 className="text-green-600" size={20} />
                </div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <p className="text-3xl font-bold">{stats.completed}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Calendar className="text-yellow-600" size={20} />
                </div>
                <span className="text-sm text-gray-600">Active</span>
              </div>
              <p className="text-3xl font-bold">{stats.active}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <TrendingUp className="text-purple-600" size={20} />
                </div>
                <span className="text-sm text-gray-600">Success Rate</span>
              </div>
              <p className="text-3xl font-bold">{stats.completionRate}%</p>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  value={user?.uid || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
