"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function MemoryListScroll({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = `memory-scroll:${pathname}?${searchParams.toString()}`;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const saved = sessionStorage.getItem(key);
    if (saved) {
      el.scrollTop = Number(saved);
    }

    function onScroll() {
      if (el) sessionStorage.setItem(key, String(el.scrollTop));
    }

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [key]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
