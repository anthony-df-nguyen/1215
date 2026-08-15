"use client";

import { useState } from "react";
import type { DatePrecision, Memory, MemoryLink } from "@/db/schema";

const MAX_IMAGES = 3;
const MAX_LINKS = 10;

type Props = {
  action: (formData: FormData) => void;
  memory?: Memory;
  onDone?: () => void;
  submitLabel: string;
};

function todayDateValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function initialDateValue(memory: Memory | undefined) {
  if (!memory) return todayDateValue();
  if (memory.datePrecision === "year") return memory.memoryDate.slice(0, 4);
  if (memory.datePrecision === "month") return memory.memoryDate.slice(0, 7);
  return memory.memoryDate;
}

const inputClass =
  "rounded-xl border border-stone-200 bg-amber-50/40 px-3 py-2 text-stone-800 outline-none transition-colors focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100";

export function MemoryForm({ action, memory, onDone, submitLabel }: Props) {
  const [precision, setPrecision] = useState<DatePrecision>(
    memory?.datePrecision ?? "day"
  );
  const [dateValue, setDateValue] = useState(initialDateValue(memory));
  const [images, setImages] = useState<string[]>(memory?.images ?? []);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [links, setLinks] = useState<MemoryLink[]>(memory?.links ?? []);
  const [linkUrlInput, setLinkUrlInput] = useState("");
  const [linkLabelInput, setLinkLabelInput] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);

  function addImage() {
    const url = imageUrlInput.trim();
    if (!url) return;

    if (images.length >= MAX_IMAGES) {
      setImageError(`You can have at most ${MAX_IMAGES} photos`);
      return;
    }
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      setImageError("Enter a valid URL");
      return;
    }
    if (parsed.protocol !== "https:") {
      setImageError("URL must start with https://");
      return;
    }
    if (images.includes(url)) {
      setImageError("That photo is already added");
      return;
    }

    setImages((prev) => [...prev, url]);
    setImageUrlInput("");
    setImageError(null);
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  function addLink() {
    const url = linkUrlInput.trim();
    if (!url) return;

    if (links.length >= MAX_LINKS) {
      setLinkError(`You can have at most ${MAX_LINKS} links`);
      return;
    }
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      setLinkError("Enter a valid URL");
      return;
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      setLinkError("URL must start with http:// or https://");
      return;
    }
    if (links.some((l) => l.url === url)) {
      setLinkError("That link is already added");
      return;
    }

    const label = linkLabelInput.trim();
    setLinks((prev) => [...prev, label ? { url, label } : { url }]);
    setLinkUrlInput("");
    setLinkLabelInput("");
    setLinkError(null);
  }

  function removeLink(url: string) {
    setLinks((prev) => prev.filter((l) => l.url !== url));
  }

  function computeMemoryDate(): string {
    if (precision === "year") {
      const year = dateValue.padStart(4, "0").slice(0, 4);
      return `${year || "0001"}-01-01`;
    }
    if (precision === "month") {
      return dateValue ? `${dateValue}-01` : "";
    }
    return dateValue;
  }

  function handlePrecisionChange(next: DatePrecision) {
    setPrecision(next);
    setDateValue("");
  }

  return (
    <form action={action} onSubmit={() => onDone?.()} className="flex flex-col gap-3">
      {memory && <input type="hidden" name="id" value={memory.id} />}
      <input type="hidden" name="memoryDate" value={computeMemoryDate()} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="links" value={JSON.stringify(links)} />
      <div className="font-bold">Add a New Memory</div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-stone-600" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={memory?.title}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-stone-600" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={memory?.description ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-col gap-1 sm:w-36">
          <label className="text-sm font-medium text-stone-600" htmlFor="datePrecision">
            Precision
          </label>
          <select
            id="datePrecision"
            name="datePrecision"
            value={precision}
            onChange={(e) => handlePrecisionChange(e.target.value as DatePrecision)}
            className={inputClass}
          >
            <option value="day">Exact day</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <label className="text-sm font-medium text-stone-600" htmlFor="dateValue">
            Date
          </label>
          {precision === "year" ? (
            <input
              id="dateValue"
              type="number"
              required
              min={1}
              max={9999}
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className={inputClass}
            />
          ) : precision === "month" ? (
            <input
              id="dateValue"
              type="month"
              required
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className={inputClass}
            />
          ) : (
            <input
              id="dateValue"
              type="date"
              required
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className={inputClass}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-stone-600" htmlFor="imageUrlInput">
          Photos
        </label>

        {images.length > 0 && (
          <div className="mb-1 flex flex-wrap gap-2">
            {images.map((src) => (
              <div key={src} className="group relative h-20 w-20 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-full w-full rounded-xl object-cover shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => removeImage(src)}
                  aria-label="Remove photo"
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-stone-800 text-xs text-white shadow-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length < MAX_IMAGES && (
          <div className="flex gap-2">
            <input
              id="imageUrlInput"
              type="url"
              placeholder="https://photos.google.com/... or any image link"
              value={imageUrlInput}
              onChange={(e) => {
                setImageUrlInput(e.target.value);
                setImageError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImage();
                }
              }}
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={addImage}
              className="shrink-0 rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-50"
            >
              Add
            </button>
          </div>
        )}
        {imageError && <p className="text-xs text-rose-500">{imageError}</p>}
        <p className="text-xs text-stone-400">
          Paste a link to a photo (e.g. a shared Google Photos image). Up to {MAX_IMAGES}.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-stone-600" htmlFor="linkUrlInput">
          Links
        </label>

        {links.length > 0 && (
          <ul className="mb-1 flex flex-col gap-1">
            {links.map((link) => (
              <li
                key={link.url}
                className="flex items-center justify-between gap-2 rounded-xl border border-stone-200 bg-amber-50/40 px-3 py-2 text-sm"
              >
                <span className="truncate text-stone-700">{link.label || link.url}</span>
                <button
                  type="button"
                  onClick={() => removeLink(link.url)}
                  aria-label="Remove link"
                  className="shrink-0 text-stone-400 transition-colors hover:text-stone-700"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {links.length < MAX_LINKS && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="linkUrlInput"
              type="url"
              placeholder="https://..."
              value={linkUrlInput}
              onChange={(e) => {
                setLinkUrlInput(e.target.value);
                setLinkError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLink();
                }
              }}
              className={`${inputClass} flex-1`}
            />
            <input
              id="linkLabelInput"
              type="text"
              placeholder="Label (optional)"
              value={linkLabelInput}
              onChange={(e) => setLinkLabelInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLink();
                }
              }}
              className={`${inputClass} sm:w-40`}
            />
            <button
              type="button"
              onClick={addLink}
              className="shrink-0 rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-50"
            >
              Add
            </button>
          </div>
        )}
        {linkError && <p className="text-xs text-rose-500">{linkError}</p>}
        <p className="text-xs text-stone-400">
          Add links to anything related to this memory. Up to {MAX_LINKS}.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        <button
          type="submit"
          className="rounded-full bg-amber-500 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-amber-600"
        >
          {submitLabel}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="rounded-full border border-stone-200 px-4 py-2 text-stone-600 transition-colors hover:bg-stone-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
