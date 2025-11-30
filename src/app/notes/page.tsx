"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { NotesProvider, useNotes, Note } from "@/context/NotesContext";
import NotesGrid from "@/components/notes/NotesGrid";
import NoteEditorModal from "@/components/notes/NoteEditorModal";
import { Search, Plus, StickyNote, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

function NotesContent() {
  const { notes, loading } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags || [])));

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? note.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background pb-20 md:pb-0">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <StickyNote className="text-primary" size={32} />
                My Notes
              </h1>
              <p className="text-gray-600">Capture ideas, lists, and inspiration.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 active:scale-95"
              >
                <Plus size={20} />
                <span className="font-medium hidden sm:inline">New Note</span>
              </button>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              <Filter size={16} className="text-gray-400 mr-2 flex-shrink-0" />
              <button
                onClick={() => setSelectedTag(null)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                  selectedTag === null
                    ? "bg-primary text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    tag === selectedTag
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  )}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pl-1">
                Pinned
              </h2>
              <NotesGrid notes={pinnedNotes} onEdit={handleEdit} />
            </div>
          )}

          {/* Other Notes */}
          <div>
            {pinnedNotes.length > 0 && otherNotes.length > 0 && (
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pl-1">
                Others
              </h2>
            )}
            <NotesGrid notes={otherNotes} onEdit={handleEdit} />
          </div>
        </div>
      </main>

      <NoteEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        noteToEdit={editingNote}
      />
    </div>
  );
}

export default function NotesPage() {
  return (
    <NotesProvider>
      <NotesContent />
    </NotesProvider>
  );
}
