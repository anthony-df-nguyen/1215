import { db } from "@/db";
import { memories } from "@/db/schema";
import { desc } from "drizzle-orm";
import { auth, signIn, signOut } from "@/auth";
import { AddMemoryForm } from "@/components/AddMemoryForm";
import { MemoryCard } from "@/components/MemoryCard";
import { memoryYear } from "@/lib/date";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-black">
        <h1 className="text-2xl font-semibold">Shared Memories</h1>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button
            type="submit"
            className="rounded-full bg-foreground px-5 py-3 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    );
  }

  const allMemories = await db.query.memories.findMany({
    orderBy: [desc(memories.memoryDate), desc(memories.createdAt)],
  });

  const groups: { year: string; items: typeof allMemories }[] = [];
  for (const memory of allMemories) {
    const year = memoryYear(memory.memoryDate);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup?.year === year) {
      lastGroup.items.push(memory);
    } else {
      groups.push({ year, items: [memory] });
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Shared Memories</h1>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit" className="text-sm text-zinc-500 hover:underline dark:text-zinc-400">
              Sign out
            </button>
          </form>
        </div>

        <AddMemoryForm />

        {groups.length === 0 && (
          <p className="text-zinc-500 dark:text-zinc-400">No memories yet. Add the first one.</p>
        )}

        <div className="flex flex-col gap-8">
          {groups.map((group) => (
            <section key={group.year} className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                {group.year}
              </h2>
              <div className="flex flex-col gap-4 border-l-2 border-zinc-200 pl-4 dark:border-zinc-800">
                {group.items.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
