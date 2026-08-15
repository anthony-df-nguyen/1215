"use client";

import { useState } from "react";
import { createMemory } from "@/app/actions";
import { MemoryForm } from "./MemoryForm";

export function AddMemoryForm() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-full bg-amber-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600"
      >
        + Add Memory
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-900/40 p-4 py-8 sm:items-center">
      <div className="w-full max-w-lg rounded-2xl border border-amber-100 bg-white p-4 shadow-lg sm:p-6">
        <MemoryForm action={createMemory} onDone={() => setOpen(false)} submitLabel="Add memory" />
      </div>
    </div>
  );
}
