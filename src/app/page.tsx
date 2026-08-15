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
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-gradient-to-b from-amber-50 via-rose-50 to-white">
        <span className="text-4xl">☀️</span>
        <h1 className="text-2xl text-center font-semibold text-stone-800">
          Anthony & Rachel
        </h1>

        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button
            type="submit"
            className="rounded-full bg-amber-500 px-5 py-2 font-medium text-white shadow-sm transition-colors hover:bg-amber-600"
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
    <div className="flex h-dvh flex-1 flex-col overflow-hidden bg-gradient-to-b from-amber-50 via-rose-50/40 to-white">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden px-4 sm:px-6">
        <div className="sticky top-0 z-10 flex flex-col gap-5 from-amber-50 via-rose-50/40 to-white pt-6 pb-5 sm:gap-6 sm:pt-10 sm:pb-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="flex min-w-0 items-center gap-2 text-xl leading-none font-semibold text-stone-800 sm:text-2xl">
              <span aria-hidden className="shrink-0 leading-none">
                ✨
              </span>
              <span className="truncate leading-none">Anthony & Rachel</span>
            </h1>
            <UserMenu
              name={session.user.name}
              email={session.user.email}
              image={session.user.image}
              signOutAction={signOutAction}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <YearFilter years={years} />
            <AddMemoryForm />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-6 sm:pb-10">
          <div className="flex flex-col gap-5 sm:gap-6">
            {groups.length === 0 && allMemories.length === 0 && (
              <p className="text-stone-400">
                No memories yet. Add the first one.
              </p>
            )}

            {groups.length === 0 && allMemories.length > 0 && (
              <p className="text-stone-400">No memories in {selectedYear}.</p>
            )}

            <div className="flex flex-col gap-8">
              {groups.map((group) => (
                <section key={group.year} className="flex flex-col gap-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-600">
                    {group.year}
                  </h2>
                  <div className="flex flex-col gap-4 border-l-2 border-amber-200 pl-3 sm:pl-4">
                    {group.items.map((memory) => (
                      <MemoryCard key={memory.id} memory={memory} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
