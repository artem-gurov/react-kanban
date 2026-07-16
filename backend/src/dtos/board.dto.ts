import type { Board } from "@shared/types";
import { BoardDocument } from "../models/Board.model";

export interface CreateBoardDTO {
  title: string;
  columns: string[];
};

export const mapBoardDocumentToBoard = (doc: BoardDocument): Board => ({
  id: doc._id.toString(),
  title: doc.title,
  columns: doc.columns.map(colId => colId.toString()),
})