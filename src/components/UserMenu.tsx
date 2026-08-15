"use client";

import { useEffect, useRef, useState } from "react";
import { UserAvatar } from "./UserAvatar";

export function UserMenu({
  name,
  email,
  image,
  signOutAction,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  signOutAction: () => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className="">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center rounded-full transition-shadow focus:outline-none focus:ring-2 focus:ring-amber-200"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <UserAvatar name={name} email={email} image={image} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-10 mt-2 w-44 overflow-hidden rounded-xl border border-amber-100 bg-white p-1 shadow-lg"
        >
          {(name || email) && (
            <div className="truncate px-3 py-2 text-xs text-stone-400">
              {name ?? email}
            </div>
          )}
          <form
            action={signOutAction}
            onSubmit={() => setOpen(false)}
          >
            <button
              type="submit"
              role="menuitem"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-stone-600 transition-colors hover:bg-amber-50"
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
