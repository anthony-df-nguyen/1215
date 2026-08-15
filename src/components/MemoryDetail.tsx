"use client";

import Link from "next/link";
import { useState } from "react";
import type { Memory } from "@/db/schema";
import { updateMemory, deleteMemory } from "@/app/actions";
import { formatMemoryDate } from "@/lib/date";
import { MemoryForm } from "./MemoryForm";

export function MemoryDetail({ memory }: { memory: Memory }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <MemoryForm
        action={updateMemory}
        memory={memory}
        heading="Edit memory"
        onDone={() => setEditing(false)}
        submitLabel="Save changes"
      />
    );
  }

  const [lead, ...rest] = memory.images;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
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
            <button type="submit" className="btn btn-ghost btn-sm text-clay-700">
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
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="washed col-span-2 h-45 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lead} alt="" className="h-full w-full object-cover" />
          </div>
          {rest.map((src) => (
            <div
              key={src}
              className={`washed h-26 overflow-hidden rounded-md ${
                rest.length === 1 ? "col-span-2" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
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

      <div className="mt-5 flex justify-between gap-3 rounded-full bg-sand-100 px-4 py-3 text-xs text-sand-700">
        <span className="truncate">Added by {memory.createdBy}</span>
        <span className="shrink-0">
          {formatMemoryDate(memory.memoryDate, memory.datePrecision)}
        </span>
      </div>
    </div>
  );
}
