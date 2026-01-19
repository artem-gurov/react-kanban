import { useState } from "react";
import type { Task } from "../types/boardManagement.types";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";
import { getPriorityColors } from "../utils/priorityColors";

type TaskDetailsModalProps = {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isOpen: boolean;
}

function TaskDetailsModal({ task, onClose, onEdit, onDelete, isOpen }: TaskDetailsModalProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const handleConfirmDelete = () => {
    setIsDeleteOpen(false);
    onDelete();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="w-full max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 truncate pr-8">{task.title}</h2>

          <div className="space-y-4 mb-6">
            <div>
              <h4 className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </h4>
              <p className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed bg-white p-3 rounded">
                {task.description || <span className="text-gray-400 italic">No description</span>}
              </p>
            </div>

            <div className="flex gap-6">
              <div>
                <h4 className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </h4>
                <div
                  data-testid="priority-badge"
                  data-priority={task.priority || "none"}
                  className={`inline-block px-3 py-1 rounded text-xs font-medium capitalize ${getPriorityColors(task.priority).badge}`}
                >
                  {task.priority ? task.priority : "none"}
                </div>
              </div>

              {task.dueDate && (
                <div>
                  <h4 className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </h4>
                  <p className="text-gray-700 text-sm">{formatDate(task.dueDate)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <div className="flex gap-2 justify-end">
              <button
                data-testid="edit-task-button"
                onClick={onEdit}
                className="px-4 py-2 bg-[#0079bf] text-white rounded hover:bg-[#026aa7] transition-colors"
              >
                Edit
              </button>
              <button
                data-testid="delete-task-button"
                onClick={() => setIsDeleteOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
}

export default TaskDetailsModal;