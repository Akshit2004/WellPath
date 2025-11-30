"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase"; // Assuming db is exported from firebase lib
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy
} from "firebase/firestore";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
}

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load notes
  useEffect(() => {
    if (!user) {
      // Local Storage for Guest
      const savedNotes = localStorage.getItem("local_notes");
      if (savedNotes) {
        try {
          setNotes(JSON.parse(savedNotes));
        } catch (e) {
          console.error("Failed to parse local notes", e);
          setNotes([]);
        }
      } else {
        setNotes([]);
      }
      setLoading(false);
      return;
    }

    // Firestore for User
    setLoading(true);
    const q = query(
      collection(db, `users/${user.uid}/notes`),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Note[];
      setNotes(fetchedNotes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Save to Local Storage Helper
  const saveToLocalStorage = (newNotes: Note[]) => {
    localStorage.setItem("local_notes", JSON.stringify(newNotes));
    setNotes(newNotes);
  };

  const addNote = async (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    const now = Date.now();
    
    if (!user) {
      const newNote: Note = {
        ...noteData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      };
      saveToLocalStorage([newNote, ...notes]);
      return;
    }

    await addDoc(collection(db, `users/${user.uid}/notes`), {
      ...noteData,
      createdAt: now,
      updatedAt: now,
    });
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!user) {
      const updatedNotes = notes.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
      );
      saveToLocalStorage(updatedNotes);
      return;
    }

    await updateDoc(doc(db, `users/${user.uid}/notes`, id), {
      ...updates,
      updatedAt: Date.now(),
    });
  };

  const deleteNote = async (id: string) => {
    if (!user) {
      const updatedNotes = notes.filter((note) => note.id !== id);
      saveToLocalStorage(updatedNotes);
      return;
    }

    await deleteDoc(doc(db, `users/${user.uid}/notes`, id));
  };

  const togglePin = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    await updateNote(id, { isPinned: !note.isPinned });
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        addNote,
        updateNote,
        deleteNote,
        togglePin,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}
