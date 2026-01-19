import { useState } from "react";
import type { Task } from "../types/boardManagement.types";
import { useBoardContext } from "../context/useBoardContext";
import TaskFormModal from "./TaskFormModal";
import ConfirmDialog from "./ConfirmDialog";

interface TaskActionsProps {
  boardId: string;
  task: Task;
  onClose: () => void;
}

function TaskActions({ boardId, task, onClose }: TaskActionsProps) {
  const { dispatch } = useBoardContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSaveEdit = (taskData: Omit<Task, "id">) => {
    dispatch({
      type: "UPDATE_TASK",
      payload: { boardId, taskId: task.id, ...taskData },
    });
    setIsEditModalOpen(false);
    onClose();
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = () => {
    dispatch({
      type: "DELETE_TASK",
      payload: { boardId, taskId: task.id },
    });
    setIsDeleteOpen(false);
    onClose();
  };

  return (
    <>
      <div className="flex gap-2 justify-end">
        <button
          data-testid="edit-task-button"
          onClick={() => setIsEditModalOpen(true)}
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

      <TaskFormModal
        isOpen={isEditModalOpen}
        task={task}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSaveEdit}
        title="Edit Task"
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
}

export default TaskActions;