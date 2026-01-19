import { useContext } from "react";
import { BoardContext } from "./BoardContext";

export function useBoardContext() {
  const context = useContext(BoardContext);

  if (!context) {
    throw new Error("useBoardContext must be used within BoardProvider");
  }

  return context;
}