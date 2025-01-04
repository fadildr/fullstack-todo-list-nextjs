export interface User {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "NOT_STARTED" | "ON_PROGRESS" | "REJECT" | "DONE";
  assignedUserId: number;
  createdById: number;
  created_at: string;
  updated_at: string;
  assignedUser: User;
  created_by: User;
}
export enum TaskStatus {
  NOT_STARTED = "NOT_STARTED",
  ON_PROGRESS = "ON_PROGRESS",
  DONE = "DONE",
  REJECT = "REJECT",
}
