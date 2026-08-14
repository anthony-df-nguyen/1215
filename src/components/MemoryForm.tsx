"use client";

import { useState } from "react";
import type { DatePrecision, Memory } from "@/db/schema";

type Props = {
  action: (formData: FormData) => void;
  memory?: Memory;
  onDone?: () => void;
  submitLabel: string;
};

function initialDateValue(memory: Memory | undefined) {
  if (!memory) return "";
  if (memory.datePrecision === "year") return memory.memoryDate.slice(0, 4);
  if (memory.datePrecision === "month") return memory.memoryDate.slice(0, 7);
  return memory.memoryDate;
}

export function MemoryForm({ action, memory, onDone, submitLabel }: Props) {
  const [precision, setPrecision] = useState<DatePrecision>(
    memory?.datePrecision ?? "day"
  );
  const [dateValue, setDateValue] = useState(initialDateValue(memory));

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

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={memory?.title}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={memory?.description ?? ""}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="datePrecision">
            Precision
          </label>
          <select
            id="datePrecision"
            name="datePrecision"
            value={precision}
            onChange={(e) => handlePrecisionChange(e.target.value as DatePrecision)}
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="day">Exact day</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="dateValue">
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
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          ) : precision === "month" ? (
            <input
              id="dateValue"
              type="month"
              required
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          ) : (
            <input
              id="dateValue"
              type="date"
              required
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-foreground px-4 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          {submitLabel}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="rounded border border-zinc-300 px-4 py-2 dark:border-zinc-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
