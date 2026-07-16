import { Schema, Document, Types, model } from "mongoose";

export interface BoardDocument extends Document {
  title: string;
  columns: Types.ObjectId[];
}

const BoardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    columns: {
      type: [Types.ObjectId],
      ref: 'Column',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const BoardModel = model<BoardDocument>('Board', BoardSchema, 'boards');