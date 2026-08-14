import { pgTable, serial, text, date, varchar, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";

export const datePrecisionEnum = pgEnum("date_precision", ["day", "month", "year"]);

export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  memoryDate: date("memory_date", { mode: "string" }).notNull(),
  datePrecision: datePrecisionEnum("date_precision").notNull().default("day"),
  createdBy: varchar("created_by", { length: 256 }).notNull(),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Memory = typeof memories.$inferSelect;
export type NewMemory = typeof memories.$inferInsert;
export type DatePrecision = (typeof datePrecisionEnum.enumValues)[number];
