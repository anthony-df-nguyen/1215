import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { neonConfig } from "@neondatabase/serverless";

config({ path: ".env.local" });

if (process.env.NODE_ENV !== "production") {
  neonConfig.wsProxy = (host) => `${host}:4444/v2`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineConnect = false;
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
