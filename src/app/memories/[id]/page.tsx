import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { memories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { MemoryDetail } from "@/components/MemoryDetail";

export default async function MemoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    notFound();
  }

  const { id } = await params;
  const memoryId = Number(id);
  if (!Number.isInteger(memoryId)) {
    notFound();
  }

  const memory = await db.query.memories.findFirst({
    where: eq(memories.id, memoryId),
  });

  if (!memory) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-amber-50 via-rose-50/40 to-white">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-4 py-6 sm:gap-6 sm:px-6 sm:py-10">
        <Link
          href="/"
          className="text-sm font-medium text-amber-600 hover:underline"
        >
          ← Back to timeline
        </Link>

        <MemoryDetail memory={memory} />
      </main>
    </div>
  );
}
