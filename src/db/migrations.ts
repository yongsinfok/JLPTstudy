// Database migrations will be added here when needed
// For Phase 1, we only have version 1

import { db } from './schema';

export async function runMigrations(): Promise<void> {
  // Future migrations will be handled here
  await db.open();
}
