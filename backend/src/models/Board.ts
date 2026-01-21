import mongoose, { Schema } from "mongoose";
import type { Board } from "@shared/types";

export interface BoardDocument extends Omit<Board, "id"> {
  id: string;
}

const TaskSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: String },
  priority: { type: String, enum: ["none", "low", "medium", "high"] },
}, { _id: false });

const ColumnSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  taskIds: { type: [String], default: [] },
}, { _id: false });

const BoardSchema = new Schema<BoardDocument>(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true },
    columns: { type: [ColumnSchema], default: [] },
    tasks: { type: Map, of: TaskSchema, default: {} },
  },
  {
    _id: false,
    timestamps: true,
  }
);

export const BoardModel = mongoose.model<BoardDocument>("Board", BoardSchema);
