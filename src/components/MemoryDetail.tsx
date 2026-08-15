"use client";

import { useEffect, useRef, useState } from "react";
import type { Memory } from "@/db/schema";
import { updateMemory, deleteMemory } from "@/app/actions";
import { formatMemoryDate } from "@/lib/date";
import { MemoryForm } from "./MemoryForm";

export function MemoryDetail({ memory }: { memory: Memory }) {
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  if (editing) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
        <MemoryForm
          action={updateMemory}
          memory={memory}
          onDone={() => setEditing(false)}
          submitLabel="Save changes"
        />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
      <div ref={menuRef} className="absolute right-3 top-3">
        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Memory options"
          aria-expanded={menuOpen}
          className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-50"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <circle cx="10" cy="4" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="10" cy="16" r="1.5" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
            <button
              onClick={() => {
                setMenuOpen(false);
                setEditing(true);
              }}
              className="block w-full px-3 py-2 text-left text-sm text-stone-600 transition-colors hover:bg-stone-50"
            >
              Edit
            </button>
            <form
              action={deleteMemory}
              onSubmit={(e) => {
                if (!confirm("Delete this memory? This cannot be undone.")) {
                  e.preventDefault();
                }
              }}
            >
              <input type="hidden" name="id" value={memory.id} />
              <button
                type="submit"
                className="block w-full px-3 py-2 text-left text-sm text-rose-500 transition-colors hover:bg-rose-50"
              >
                Delete
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="pr-10">
        <p className="text-sm font-medium text-amber-600">
          {formatMemoryDate(memory.memoryDate, memory.datePrecision)}
        </p>
        <h3 className="text-lg font-semibold text-stone-800">{memory.title}</h3>
      </div>

      {memory.description && (
        <p className="mt-2 whitespace-pre-wrap text-stone-600">
          {memory.description}
        </p>
      )}

      {memory.images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {memory.images.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className="h-24 w-24 rounded-xl object-cover shadow-sm"
            />
          ))}
        </div>
      )}

      {memory.links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {memory.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-full truncate rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700 transition-colors hover:bg-amber-100"
            >
              {link.label || link.url}
            </a>
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-stone-400">
        Added by {memory.createdBy}
      </p>
    </div>
  );
}
