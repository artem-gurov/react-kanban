import type { Column } from "@shared/types";
import { ColumnDocument } from "../models/Column.model";

export interface CreateColumnDTO {
  title: string;
  tasks: string[];
};

export const mapColumnDocumentToColumn = (doc: ColumnDocument): Column => ({
  id: doc._id.toString(),
  title: doc.title,
  tasks: doc.tasks.map(taskId => taskId.toString()),
})