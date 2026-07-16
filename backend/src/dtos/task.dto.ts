import type { Priority, Task } from "@shared/types";
import { TaskDocument } from "../models/Task.model";

export interface CreateTaskDTO {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  columnId: string;
};

export const mapTaskDocumentToTask = (doc: TaskDocument): Task => ({
  id: doc._id.toString(),
  title: doc.title,
  description: doc.description,
  dueDate: doc.dueDate?.toISOString(),
  priority: doc.priority,
})