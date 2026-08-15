"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function YearFilter({ years }: { years: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get("year") ?? "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const year = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (year) {
      params.set("year", year);
    } else {
      params.delete("year");
    }
    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  }

  if (years.length === 0) return null;

  return (
    <select
      value={selected}
      onChange={handleChange}
      className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
      aria-label="Filter by year"
    >
      <option value="">All years</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
}
