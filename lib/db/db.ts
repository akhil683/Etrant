import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// const sql = neon(process.env.DATABASE_URL!);
const sql = neon(
  "postgresql://neondb_owner:npg_y5EWmYHDCI1l@ep-hidden-tree-a1041pdx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
);
export const db = drizzle({ client: sql });
