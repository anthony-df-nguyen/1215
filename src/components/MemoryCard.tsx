import Link from "next/link";
import type { Memory } from "@/db/schema";
import { formatMemoryDate } from "@/lib/date";

export function MemoryCard({ memory }: { memory: Memory }) {
  return (
    <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/memories/${memory.id}`} className="block">
        <div>
          <p className="text-xs font-medium text-amber-600">
            {formatMemoryDate(memory.memoryDate, memory.datePrecision)}
          </p>
          <h3 className="text-md font-semibold text-stone-800">{memory.title}</h3>
        </div>

        {memory.description && (
          <p className="mt-2 text-sm whitespace-pre-wrap text-stone-600">
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
                className="h-24 w-24 rounded-xl object-cover shadow-sm"
              />
            ))}
          </div>
        )}
      </Link>

      {memory.links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {memory.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-full truncate rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700 transition-colors hover:bg-amber-100"
            >
              {link.label || link.url}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
