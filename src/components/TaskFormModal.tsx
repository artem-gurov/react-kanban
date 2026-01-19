import { useState } from "react";
import type { Task, Priority } from "../types/boardManagement.types";
import Modal from "./Modal";

type TaskFormModalProps = {
  isOpen: boolean;
  task?: Task;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, "id">) => void;
  title?: string;
};

function TaskFormModal({ isOpen, task, onClose, onSubmit, title = "Add Task" }: TaskFormModalProps) {
  const [formData, setFormData] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    dueDate: task?.dueDate ?? "",
    priority: (task?.priority ?? "none") as Priority,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      dueDate: formData.dueDate || undefined,
      priority: formData.priority,
    });

    setFormData({
      title: "",
      description: "",
      dueDate: "",
      priority: "none",
    });
  };

  const handleClose = () => {
    setFormData({
      title: task?.title ?? "",
      description: task?.description ?? "",
      dueDate: task?.dueDate ?? "",
      priority: (task?.priority ?? "none") as Priority,
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="w-96">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="task-title" className="block mb-2 font-medium text-gray-700 text-sm">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              id="task-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter a title for this card"
              className={`w-full px-3 py-2 border rounded bg-white focus:outline-none text-gray-900 placeholder-gray-400 ${
                errors.title ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.title && (
              <p className="text-red-600 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="task-description" className="block mb-2 font-medium text-gray-700 text-sm">
              Description
            </label>
            <textarea
              id="task-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add a more detailed description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 items-stretch">
            <div className="flex flex-col">
              <label htmlFor="task-duedate" className="block mb-2 font-medium text-gray-700 text-sm">
                Due Date
              </label>
              <input
                id="task-duedate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500 text-gray-900"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="task-priority" className="block mb-2 font-medium text-gray-700 text-sm">
                Priority
              </label>
              <select
                id="task-priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:border-blue-500 text-gray-900"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-4 justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#0079bf] text-white rounded hover:bg-[#026aa7] transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default TaskFormModal;
