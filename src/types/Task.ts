
export type Priority = "P1" | "P2" | "P3";

export interface Task {
  id: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}
