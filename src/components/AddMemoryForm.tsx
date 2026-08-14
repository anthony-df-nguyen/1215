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
        className="self-start rounded bg-foreground px-4 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Add memory
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <MemoryForm action={createMemory} onDone={() => setOpen(false)} submitLabel="Add memory" />
    </div>
  );
}
