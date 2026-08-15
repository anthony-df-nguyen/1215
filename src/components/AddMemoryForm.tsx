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
        className="btn btn-primary btn-sm shrink-0"
      >
        + Memory
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-sand-900/50 p-4 py-8 sm:items-center">
      <div className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-lg bg-cream shadow-lg">
        <MemoryForm
          action={createMemory}
          heading="New memory"
          onDone={() => setOpen(false)}
          submitLabel="Save memory"
        />
      </div>
    </div>
  );
}
