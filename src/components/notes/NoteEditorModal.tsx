"use client";

import React, { useState, useEffect, useRef } from "react";
import { Note, useNotes } from "@/context/NotesContext";
import { X, Save, Pin, Palette, Hash, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteToEdit?: Note | null;
}

const COLORS = [
  { value: "", label: "Default" },
  { value: "#fef3c7", label: "Amber" }, // amber-100
  { value: "#dcfce7", label: "Emerald" }, // emerald-100
  { value: "#dbeafe", label: "Blue" }, // blue-100
  { value: "#f3e8ff", label: "Purple" }, // purple-100
  { value: "#ffe4e6", label: "Rose" }, // rose-100
  { value: "#f1f5f9", label: "Slate" }, // slate-100
];

export default function NoteEditorModal({ isOpen, onClose, noteToEdit }: NoteEditorModalProps) {
  const { addNote, updateNote } = useNotes();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [color, setColor] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setTags(noteToEdit.tags || []);
      setColor(noteToEdit.color || "");
      setIsPinned(noteToEdit.isPinned || false);
    } else {
      resetForm();
    }
  }, [noteToEdit, isOpen]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setTagInput("");
    setColor("");
    setIsPinned(false);
    setIsZenMode(false);
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      onClose();
      return;
    }

    const noteData = {
      title,
      content,
      tags,
      color,
      isPinned,
    };

    if (noteToEdit) {
      await updateNote(noteToEdit.id, noteData);
    } else {
      await addNote(noteData);
    }
    onClose();
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleSave}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={cn(
            "relative w-full bg-white shadow-2xl overflow-hidden flex flex-col transition-all duration-500",
            isZenMode ? "fixed inset-0 rounded-none h-full z-[60]" : "max-w-3xl rounded-3xl h-[85vh] sm:h-auto sm:max-h-[85vh]",
            color ? "" : "bg-white"
          )}
          style={{ backgroundColor: color || "#ffffff" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-black/5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsZenMode(!isZenMode)}
                className="p-2 hover:bg-black/5 rounded-full text-gray-500 transition-colors"
                title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
              >
                {isZenMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button
                onClick={() => setIsPinned(!isPinned)}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isPinned ? "bg-primary/10 text-primary" : "hover:bg-black/5 text-gray-500"
                )}
                title="Pin Note"
              >
                <Pin size={20} className={isPinned ? "fill-current" : ""} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Color Picker */}
              <div className="flex items-center gap-1 mr-2">
                {COLORS.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => setColor(c.value)}
                    className={cn(
                      "w-6 h-6 rounded-full border border-black/10 transition-transform hover:scale-110",
                      color === c.value ? "ring-2 ring-primary ring-offset-2" : ""
                    )}
                    style={{ backgroundColor: c.value || "#ffffff" }}
                    title={c.label}
                  />
                ))}
              </div>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium"
              >
                <Save size={18} />
                <span>Save</span>
              </button>
              <button
                onClick={handleSave}
                className="p-2 hover:bg-black/5 rounded-full text-gray-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full text-3xl sm:text-4xl font-bold bg-transparent border-none outline-none placeholder:text-gray-300 mb-6"
            />
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing..."
              className="w-full h-[calc(100%-120px)] resize-none bg-transparent border-none outline-none text-lg leading-relaxed text-gray-700 placeholder:text-gray-300"
            />
          </div>

          {/* Footer - Tags */}
          <div className="p-4 sm:p-6 border-t border-black/5 bg-black/5 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Hash size={18} className="text-gray-400" />
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-sm font-medium text-gray-600 shadow-sm"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag..."
                className="bg-transparent border-none outline-none text-sm min-w-[100px]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
