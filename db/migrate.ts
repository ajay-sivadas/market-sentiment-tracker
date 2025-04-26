import { db } from "./index";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "@shared/schema";

async function main() {
  console.log("Starting migration...");
  
  try {
    // Run migrations
    await migrate(db, { migrationsFolder: "./db/migrations" });
    
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
}

main(); 