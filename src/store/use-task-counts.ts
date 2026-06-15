import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { isOverdue } from '@/lib/utils';

export function useTaskCounts() {
  return useLiveQuery(async () => {
    const tasks = await db.tasks.toArray();
    const now = new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    let today = 0;
    let upcoming = 0;
    let completed = 0;
    let overdue = 0;

    tasks.forEach((task) => {
      if (task.status === 'completed') {
        completed++;
        return;
      }
      if (task.dueDate) {
        if (isOverdue(task.dueDate)) {
          overdue++;
          today++;
        } else {
          const due = new Date(task.dueDate);
          if (due <= todayEnd) {
            today++;
          } else {
            upcoming++;
          }
        }
      }
    });

    return {
      today,
      upcoming,
      completed,
      overdue,
      all: tasks.filter((t) => t.status === 'pending').length,
    };
  }) ?? { today: 0, upcoming: 0, completed: 0, overdue: 0, all: 0 };
}
