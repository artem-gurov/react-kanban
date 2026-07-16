import { Schema, Document, Types, model } from 'mongoose'
import { PRIORITIES, Priority } from '@shared/types'

export interface TaskDocument extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: Priority;
  columnId: Types.ObjectId;
};

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: PRIORITIES[0],
    },
    columnId: {
      type: Types.ObjectId,
      ref: 'Column',
      required: true,
    },
  },
  { timestamps: true }
);

export const TaskModel = model<TaskDocument>('Task', TaskSchema, 'tasks');