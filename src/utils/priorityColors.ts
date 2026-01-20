import type { Priority } from "@shared/types";

export const getPriorityColors = (priority?: Priority) => {
  switch (priority) {
    case "high":
      return {
        card: "bg-red-50 border-red-200 hover:border-red-300",
        badge: "bg-red-100 text-red-700 border border-red-200",
      };
    case "medium":
      return {
        card: "bg-yellow-50 border-yellow-200 hover:border-yellow-300",
        badge: "bg-yellow-100 text-yellow-700 border border-yellow-200",
      };
    case "low":
      return {
        card: "bg-blue-50 border-blue-200 hover:border-blue-300",
        badge: "bg-blue-100 text-blue-700 border border-blue-200",
      };
    default:
      return {
        card: "bg-white border-gray-100 hover:border-gray-300",
        badge: "bg-gray-100 text-gray-600 border border-gray-200",
      };
  }
};
