import type { DatePrecision } from "@/db/schema";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatMemoryDate(memoryDate: string, precision: DatePrecision): string {
  const [yearStr, monthStr, dayStr] = memoryDate.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (precision === "year") return String(year);
  if (precision === "month") return `${MONTH_NAMES[month - 1]} ${year}`;
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
}

export function memoryYear(memoryDate: string): string {
  return memoryDate.slice(0, 4);
}
