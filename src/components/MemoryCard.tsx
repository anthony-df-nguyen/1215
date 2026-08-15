import Link from "next/link";
import type { Memory } from "@/db/schema";
import { formatMemoryDate } from "@/lib/date";

export function MemoryCard({ memory }: { memory: Memory }) {
  return (
    <div className="rounded-md bg-sand-100 p-4 shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/memories/${memory.id}`} className="block">
        <p className="kicker">
          {formatMemoryDate(memory.memoryDate, memory.datePrecision)}
        </p>
        <h3 className="mt-1 font-heading text-[19px] leading-tight text-ink">
          {memory.title}
        </h3>

        {memory.description && (
          <p className="mt-1 text-[13px] leading-normal whitespace-pre-wrap text-sand-800">
            {memory.description}
          </p>
        )}

        {memory.images.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {memory.images.map((src) => (
              <div
                key={src}
                className="washed h-21 w-21 overflow-hidden rounded-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
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
              className="tag tag-outline max-w-full truncate transition-colors hover:bg-clay-100"
            >
              {link.label || link.url} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
