import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";

if (process.env.NODE_ENV === "development") {
  neonConfig.fetchEndpoint = (host) =>
    `http://${host}:4444/sql`;
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
