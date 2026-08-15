import { db } from "@/db";
import { memories } from "@/db/schema";
import { desc } from "drizzle-orm";
import { auth, signIn, signOut } from "@/auth";
import { AddMemoryForm } from "@/components/AddMemoryForm";
import { MemoryCard } from "@/components/MemoryCard";
import { UserMenu } from "@/components/UserMenu";
import { YearFilter } from "@/components/YearFilter";
import { memoryYear } from "@/lib/date";

async function signOutAction() {
  "use server";
  await signOut();
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-cream px-6">
        <span className="text-4xl">☀️</span>
        <h1 className="text-center text-3xl">Anthony &amp; Rachel</h1>
        <p className="max-w-xs text-center text-sm text-sand-700">
          A shared timeline of the things worth keeping.
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button type="submit" className="btn btn-primary elev-sm">
            Sign in with Google
          </button>
        </form>
      </div>
    );
  }

  const allMemories = await db.query.memories.findMany({
    orderBy: [desc(memories.memoryDate), desc(memories.createdAt)],
  });

  const years = Array.from(
    new Set(allMemories.map((m) => memoryYear(m.memoryDate))),
  ).sort((a, b) => b.localeCompare(a));

  const selectedYear = (await searchParams).year;
  const filteredMemories =
    typeof selectedYear === "string" && selectedYear
      ? allMemories.filter((m) => memoryYear(m.memoryDate) === selectedYear)
      : allMemories;

  const groups: { year: string; items: typeof allMemories }[] = [];
  for (const memory of filteredMemories) {
    const year = memoryYear(memory.memoryDate);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup?.year === year) {
      lastGroup.items.push(memory);
    } else {
      groups.push({ year, items: [memory] });
    }
  }

  return (
    <div className="flex h-dvh flex-1 flex-col overflow-hidden bg-cream">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden px-5 sm:px-6">
        <div className="sticky top-0 z-10 flex flex-col gap-4 bg-cream pt-6 pb-4 sm:pt-9">
          <div className="flex items-center justify-between gap-3">
            <h1 className="min-w-0 truncate text-xl sm:text-2xl">
              Anthony &amp; Rachel
            </h1>
            <div className="flex shrink-0 items-center gap-3">
              <AddMemoryForm />
              <UserMenu
                name={session.user.name}
                email={session.user.email}
                image={session.user.image}
                signOutAction={signOutAction}
              />
            </div>
          </div>

          <YearFilter years={years} />
        </div>

        <div className="flex-1 overflow-y-auto pb-8 sm:pb-10">
          {groups.length === 0 && allMemories.length === 0 && (
            <p className="text-sand-600">No memories yet. Add the first one.</p>
          )}

          {groups.length === 0 && allMemories.length > 0 && (
            <p className="text-sand-600">No memories in {selectedYear}.</p>
          )}

          <div className="flex flex-col gap-7">
            {groups.map((group) => (
              <section key={group.year} className="flex flex-col gap-4">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-4xl leading-none">{group.year}</h2>
                  <span className="tag tag-accent-2">
                    {group.items.length}{" "}
                    {group.items.length === 1 ? "memory" : "memories"}
                  </span>
                </div>

                <div className="flex flex-col gap-3.5">
                  {group.items.map((memory) => (
                    <MemoryCard key={memory.id} memory={memory} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
