"use server";

import { db } from "@/db";
import { memories, type DatePrecision, type MemoryLink } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

const MAX_IMAGES = 6;
const MAX_LINKS = 10;

function parseFormMemory(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const memoryDate = String(formData.get("memoryDate") ?? "");
  const datePrecision = String(formData.get("datePrecision") ?? "day") as DatePrecision;
  const images = parseImages(formData);
  const links = parseLinks(formData);

  if (!title) throw new Error("Title is required");
  if (!memoryDate) throw new Error("Date is required");
  if (!["day", "month", "year"].includes(datePrecision)) {
    throw new Error("Invalid date precision");
  }

  return { title, description: description || null, memoryDate, datePrecision, images, links };
}

function parseImages(formData: FormData): string[] {
  const raw = formData.get("images");
  if (typeof raw !== "string" || !raw) return [];

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every((v) => typeof v === "string")) {
    throw new Error("Invalid images");
  }
  if (parsed.length > MAX_IMAGES) {
    throw new Error(`You can have at most ${MAX_IMAGES} photos per memory`);
  }

  for (const url of parsed) {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      throw new Error(`Invalid image URL: ${url}`);
    }
    if (parsedUrl.protocol !== "https:") {
      throw new Error(`Image URL must be https: ${url}`);
    }
  }

  return parsed;
}

function parseLinks(formData: FormData): MemoryLink[] {
  const raw = formData.get("links");
  if (typeof raw !== "string" || !raw) return [];

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("Invalid links");
  if (parsed.length > MAX_LINKS) {
    throw new Error(`You can have at most ${MAX_LINKS} links per memory`);
  }

  return parsed.map((item) => {
    if (typeof item !== "object" || item === null || typeof item.url !== "string") {
      throw new Error("Invalid link");
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(item.url);
    } catch {
      throw new Error(`Invalid link URL: ${item.url}`);
    }
    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
      throw new Error(`Link URL must be http(s): ${item.url}`);
    }

    const label =
      typeof item.label === "string" && item.label.trim() ? item.label.trim() : undefined;

    return label ? { url: item.url, label } : { url: item.url };
  });
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
  revalidatePath(`/memories/${id}`);
}

export async function deleteMemory(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Invalid memory id");

  await db.delete(memories).where(eq(memories.id, id));

  revalidatePath("/");
  redirect("/");
}
