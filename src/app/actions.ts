"use server";

import { db } from "@/db";
import { memories, type DatePrecision } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

function parseFormMemory(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const memoryDate = String(formData.get("memoryDate") ?? "");
  const datePrecision = String(formData.get("datePrecision") ?? "day") as DatePrecision;

  if (!title) throw new Error("Title is required");
  if (!memoryDate) throw new Error("Date is required");
  if (!["day", "month", "year"].includes(datePrecision)) {
    throw new Error("Invalid date precision");
  }

  return { title, description: description || null, memoryDate, datePrecision };
}

export async function createMemory(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const values = parseFormMemory(formData);

  await db.insert(memories).values({
    ...values,
    createdBy: session.user.email,
  });

  revalidatePath("/");
}

export async function updateMemory(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid memory id");

  const values = parseFormMemory(formData);

  await db.update(memories).set(values).where(eq(memories.id, id));

  revalidatePath("/");
}

export async function deleteMemory(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid memory id");

  await db.delete(memories).where(eq(memories.id, id));

  revalidatePath("/");
}
