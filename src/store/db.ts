import Dexie, { type Table } from 'dexie';
import type { Task, Category } from '../types';

export class PrivateTasksDB extends Dexie {
  tasks!: Table<Task, string>;
  categories!: Table<Category, string>;

  constructor() {
    super('PrivateTasksDB');
    this.version(1).stores({
      tasks: 'id, status, priority, categoryId, dueDate, createdAt',
      categories: 'id, name'
    });
    this.version(2).stores({
      tasks: 'id, status, priority, categoryId, dueDate, createdAt',
      categories: 'id, name'
    }).upgrade(async (tx) => {
      // Ensure 'others' category is added for existing users
      const categoriesTable = tx.table('categories');
      const exists = await categoriesTable.get('others');
      if (!exists) {
        await categoriesTable.add({ id: 'others', name: 'Others', color: '#aaaaaf', isCustom: false });
      }
    });
    this.version(3).stores({
      tasks: 'id, status, priority, categoryId, dueDate, createdAt, urgent',
      categories: 'id, name'
    });
  }
}

export const db = new PrivateTasksDB();

// Pre-populate default categories
db.on('populate', async () => {
  await db.categories.bulkAdd([
    { id: 'cat_personal', name: 'Personal', color: '#3b82f6', isCustom: false },
    { id: 'cat_work', name: 'Work', color: '#ef4444', isCustom: false },
    { id: 'cat_education', name: 'Education', color: '#eab308', isCustom: false },
    { id: 'cat_health', name: 'Health', color: '#22c55e', isCustom: false },
    { id: 'others', name: 'Others', color: '#aaaaaf', isCustom: false },
  ]);
});

// Ensure 'others' exists for all users (including those who already had v1)
db.open().then(async () => {
  const exists = await db.categories.get('others');
  if (!exists) {
    await db.categories.add({ id: 'others', name: 'Others', color: '#aaaaaf', isCustom: false });
  }
});
