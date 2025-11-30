"use client";

import React from "react";
import { Note, useNotes } from "@/context/NotesContext";
import { Pin, Trash2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

export default function NoteCard({ note, onEdit }: NoteCardProps) {
  const { togglePin, deleteNote } = useNotes();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote(note.id);
    }
  };

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePin(note.id);
  };

  return (
    <div
      onClick={() => onEdit(note)}
      className={cn(
        "group relative p-6 rounded-3xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-white/20 overflow-hidden",
        note.color || "bg-white/80 backdrop-blur-xl"
      )}
      style={{
        background: note.color ? undefined : "rgba(255, 255, 255, 0.8)",
        backgroundColor: note.color,
      }}
    >
      {/* Pin Indicator */}
      {note.isPinned && (
        <div className="absolute top-4 right-4 text-primary">
          <Pin size={18} fill="currentColor" />
        </div>
      )}

      {/* Content */}
      <h3 className="text-xl font-bold mb-3 pr-8 line-clamp-2 text-gray-800">
        {note.title || "Untitled Note"}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-4 text-sm leading-relaxed whitespace-pre-wrap">
        {note.content || "No content..."}
      </p>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-black/5 rounded-lg text-xs font-medium text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-xs text-gray-400">
          {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePin}
            className="p-2 hover:bg-black/5 rounded-full text-gray-500 transition-colors"
            title={note.isPinned ? "Unpin" : "Pin"}
          >
            <Pin size={16} className={note.isPinned ? "fill-current" : ""} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full text-gray-500 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
