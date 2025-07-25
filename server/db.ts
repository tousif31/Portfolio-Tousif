// Load env vars (DATABASE_URL, etc.) before anything else reads them.
import "dotenv/config";

import ws from "ws";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "@shared/schema";

// Tell Neon how to create WebSocket connections in Node.
neonConfig.webSocketConstructor = ws;

// Read + validate connection string.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

// Create PG pool. (Adjust max if you like; Neon free tiers often small.)
export const pool = new Pool({
  connectionString,
  // max: 5, // uncomment to limit concurrent connections
});

// Create Drizzle client bound to schema.
export const db = drizzle({
  client: pool,
  schema,
  // Optional: verbose logs in dev
  logger: process.env.NODE_ENV === "development",
});
