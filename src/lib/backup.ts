import { db } from '../store/db';
import type { Task, Category } from '../types';

export interface BackupData {
  version: number;
  timestamp: string;
  tasks: Task[];
  categories: Category[];
}

export async function exportData(): Promise<Blob> {
  const tasks = await db.tasks.toArray();
  const categories = await db.categories.toArray();

  const data: BackupData = {
    version: 1,
    timestamp: new Date().toISOString(),
    tasks,
    categories,
  };

  const json = JSON.stringify(data, null, 2);
  return new Blob([json], { type: 'application/json' });
}

export async function importData(jsonString: string): Promise<void> {
  try {
    const data: BackupData = JSON.parse(jsonString);

    if (!data.tasks || !data.categories) {
      throw new Error("Invalid backup file format");
    }

    await db.transaction('rw', db.tasks, db.categories, async () => {
      await db.tasks.clear();
      await db.categories.clear();

      if (data.categories.length > 0) {
        await db.categories.bulkAdd(data.categories);
      }
      if (data.tasks.length > 0) {
        await db.tasks.bulkAdd(data.tasks);
      }
    });
  } catch (error) {
    console.error("Failed to import data:", error);
    throw error;
  }
}
