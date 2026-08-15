"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Memory } from "@/db/schema";
import { updateMemory, deleteMemory } from "@/app/actions";
import { formatMemoryDate } from "@/lib/date";
import { MemoryForm } from "./MemoryForm";

export function MemoryDetail({ memory }: { memory: Memory }) {
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  function goToAllMemories(e: React.MouseEvent) {
    e.preventDefault();
    // Prefer a real back-navigation so the homepage's scroll position is
    // restored (see MemoryCard, which sets this flag right before linking
    // here). Fall back to a fresh push when we weren't navigated here from
    // the homepage in this tab (e.g. a direct link/bookmark to a memory).
    if (sessionStorage.getItem("nav-from-home") === "1") {
      router.back();
    } else {
      router.push("/");
    }
  }

  if (editing) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col bg-cream">
        <div className="mx-auto flex w-full max-w-2xl min-h-0 flex-1 flex-col">
          <MemoryForm
            action={updateMemory}
            memory={memory}
            heading="Edit memory"
            onDone={() => setEditing(false)}
            submitLabel="Save changes"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          onClick={goToAllMemories}
          className="text-[13px] font-semibold text-sand-700 hover:text-clay-700"
        >
          ← All memories
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="btn btn-secondary btn-sm"
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
              className="btn btn-ghost btn-sm text-clay-700"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      <div className="mt-5">
        <span className="tag tag-accent">
          {formatMemoryDate(memory.memoryDate, memory.datePrecision)} ·{" "}
          {memory.datePrecision}
        </span>
        <h1 className="mt-3 text-3xl leading-tight">{memory.title}</h1>
        {memory.description && (
          <p className="mt-2 leading-relaxed whitespace-pre-wrap text-sand-800">
            {memory.description}
          </p>
        )}
      </div>

      {memory.images.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2.5">
          {memory.images.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className="max-h-64 w-auto max-w-full rounded-md bg-sand-100"
            />
          ))}
        </div>
      )}

      {memory.links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {memory.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tag tag-accent-2 max-w-full truncate transition-colors hover:bg-sage-200"
            >
              {link.label || link.url} ↗
            </a>
          ))}
        </div>
      )}

      <div className="mt-5 rounded-full text-xs text-sand-700">
        <span className="truncate">Added by {memory.createdBy}</span>
      </div>
    </div>
  );
}
