"use client";

import { useState } from "react";
import type { Memory } from "@/db/schema";
import { updateMemory, deleteMemory } from "@/app/actions";
import { formatMemoryDate } from "@/lib/date";
import { MemoryForm } from "./MemoryForm";

export function MemoryCard({ memory }: { memory: Memory }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
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
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatMemoryDate(memory.memoryDate, memory.datePrecision)}
          </p>
          <h3 className="text-lg font-semibold">{memory.title}</h3>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => setEditing(true)}
            className="rounded border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-700"
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
              className="rounded border border-red-300 px-3 py-1 text-sm text-red-600 dark:border-red-900 dark:text-red-400"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      {memory.description && (
        <p className="mt-2 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
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
              className="h-24 w-24 rounded object-cover"
            />
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
        Added by {memory.createdBy}
      </p>
    </div>
  );
}
