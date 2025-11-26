"use client";

import React from "react";
import { TodoProvider } from "@/context/TodoContext";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TodoProvider>{children}</TodoProvider>
    </AuthProvider>
  );
}
