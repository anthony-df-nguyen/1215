"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function YearFilter({ years }: { years: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get("year") ?? "";

  if (years.length === 0) return null;

  function href(year: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (year) {
      params.set("year", year);
    } else {
      params.delete("year");
    }
    const query = params.toString();
    return query ? `/?${query}` : "/";
  }

  return (
    <select
      aria-label="Filter by year"
      value={selected}
      onChange={(event) => router.push(href(event.target.value))}
      className="rounded-full border border-sand-300 bg-sand-100 px-3.5 py-1.5 text-xs text-sand-800 transition-colors hover:bg-sand-200 focus:border-clay focus:outline-none"
    >
      <option value="">All</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
}
