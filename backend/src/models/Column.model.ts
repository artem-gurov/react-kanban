import { Schema, Document, Types, model } from 'mongoose'

export interface ColumnDocument extends Document {
  title: string;
  tasks: Types.ObjectId[];
}

const ColumnSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: {
      type: [Types.ObjectId],
      ref: 'Task',
      default: [],
    },
  },
  { timestamps: true }
);

export const ColumnModel = model<ColumnDocument>('Column', ColumnSchema, 'columns');