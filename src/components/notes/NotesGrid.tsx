"use client";

import React from "react";
import { Note } from "@/context/NotesContext";
import NoteCard from "./NoteCard";
import Masonry from "react-masonry-css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface NotesGridProps {
  notes: Note[];
  onEdit: (note: Note) => void;
}

export default function NotesGrid({ notes, onEdit }: NotesGridProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".note-card", {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out",
      });
    },
    { scope: containerRef, dependencies: [notes] }
  );

  const breakpointColumnsObj = {
    default: 4,
    1536: 3,
    1024: 2,
    640: 1,
  };

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">📝</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No notes yet</h3>
        <p className="text-gray-500 max-w-sm">
          Capture your ideas, lists, and thoughts. Click the + button to create your first note.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {notes.map((note) => (
          <div key={note.id} className="note-card mb-4">
            <NoteCard note={note} onEdit={onEdit} />
          </div>
        ))}
      </Masonry>
    </div>
  );
}
