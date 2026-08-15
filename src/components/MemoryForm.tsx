"use client";

import { useState } from "react";
import type { DatePrecision, Memory, MemoryLink } from "@/db/schema";

const MAX_IMAGES = 3;
const MAX_LINKS = 10;

const PRECISIONS: { value: DatePrecision; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

type Props = {
  action: (formData: FormData) => void;
  memory?: Memory;
  heading: string;
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

export function MemoryForm({
  action,
  memory,
  heading,
  onDone,
  submitLabel,
}: Props) {
  const [precision, setPrecision] = useState<DatePrecision>(
    memory?.datePrecision ?? "day",
  );
  const [dateValue, setDateValue] = useState(initialDateValue(memory));
  const [images, setImages] = useState<string[]>(memory?.images ?? []);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [addingImage, setAddingImage] = useState(false);
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
    setAddingImage(false);
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
    <form action={action} onSubmit={() => onDone?.()} className="flex flex-col">
      {memory && <input type="hidden" name="id" value={memory.id} />}
      <input type="hidden" name="memoryDate" value={computeMemoryDate()} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="links" value={JSON.stringify(links)} />

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl">{heading}</h2>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="btn btn-ghost btn-sm"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            required
            defaultValue={memory?.title}
            className="input"
          />
        </div>

        <div className="field">
          <label htmlFor="description">What happened</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={memory?.description ?? ""}
            className="input"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset className="field">
            <legend>How exact is this date?</legend>
            <div className="seg">
              {PRECISIONS.map((option) => (
                <label key={option.value} className="seg-opt">
                  <input
                    type="radio"
                    name="datePrecision"
                    value={option.value}
                    checked={precision === option.value}
                    onChange={() => handlePrecisionChange(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="dateValue">Date</label>
            {precision === "year" ? (
              <input
                id="dateValue"
                type="number"
                required
                min={1}
                max={9999}
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="input"
              />
            ) : precision === "month" ? (
              <input
                id="dateValue"
                type="month"
                required
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="input"
              />
            ) : (
              <input
                id="dateValue"
                type="date"
                required
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="input"
              />
            )}
          </div>
        </div>

        <div className="field">
          <label htmlFor="imageUrlInput">Photos</label>

          <div className="flex flex-wrap gap-2.5">
            {images.map((src) => (
              <div key={src} className="relative h-17.5 w-17.5 shrink-0">
                <div className="washed h-full w-full overflow-hidden rounded-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(src)}
                  aria-label="Remove photo"
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-sand-900 text-xs text-cream shadow-sm"
                >
                  ×
                </button>
              </div>
            ))}

            {images.length < MAX_IMAGES && !addingImage && (
              <button
                type="button"
                onClick={() => setAddingImage(true)}
                aria-label="Add a photo"
                className="flex h-17.5 w-17.5 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-sand-400 text-xl text-sand-600 transition-colors hover:border-clay hover:text-clay"
              >
                +
              </button>
            )}
          </div>

          {images.length < MAX_IMAGES && addingImage && (
            <div className="mt-2.5 flex gap-2">
              <input
                id="imageUrlInput"
                type="url"
                autoFocus
                placeholder="https://photos.google.com/… or any image link"
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
                className="input flex-1"
              />
              <button
                type="button"
                onClick={addImage}
                className="btn btn-secondary btn-sm"
              >
                Add
              </button>
            </div>
          )}
          {imageError && (
            <p className="mt-1 text-xs text-clay-700">{imageError}</p>
          )}
          <p className="mt-1.5 text-xs text-sand-600">
            Paste a link to a photo (e.g. a shared Google Photos image). Up to{" "}
            {MAX_IMAGES}.
          </p>
        </div>

        <div className="field">
          <label htmlFor="linkUrlInput">Links</label>

          {links.length > 0 && (
            <ul className="mb-2 flex flex-col gap-1.5">
              {links.map((link) => (
                <li
                  key={link.url}
                  className="flex items-center justify-between gap-2 rounded-full bg-sand-100 px-4 py-2 text-sm"
                >
                  <span className="truncate text-sand-800">
                    {link.label || link.url}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLink(link.url)}
                    aria-label="Remove link"
                    className="shrink-0 text-sand-500 transition-colors hover:text-ink"
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
                placeholder="https://…"
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
                className="input flex-1"
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
                className="input sm:w-40"
              />
              <button
                type="button"
                onClick={addLink}
                className="btn btn-secondary btn-sm"
              >
                Add
              </button>
            </div>
          )}
          {linkError && (
            <p className="mt-1 text-xs text-clay-700">{linkError}</p>
          )}
          <p className="mt-1.5 text-xs text-sand-600">
            Add links to anything related to this memory. Up to {MAX_LINKS}.
          </p>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
