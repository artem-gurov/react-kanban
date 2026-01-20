import { useState } from "react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@shared/types";
import TaskFormModal from "./TaskFormModal";
import ConfirmDialog from "./ConfirmDialog";
import Icon from "./Icon";

type ColumnProps = {
  columnId: string;
  title: string;
  taskIds: string[];
  onRename: (newTitle: string) => void;
  onDelete: () => void;
  onAddTask?: (taskData: Omit<Task, "id">) => void;
}

const Column = ({
  columnId,
  title,
  taskIds,
  onRename,
  onDelete,
  onAddTask,
  children
}: React.PropsWithChildren<ColumnProps>) => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: columnId,
    data: {
      type: 'column',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAddTask = (taskData: Omit<Task, "id">) => {
    onAddTask?.(taskData);
    setIsAddTaskModalOpen(false);
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== title) {
      onRename(editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="shrink-0 w-72 bg-white rounded-xl p-3 flex flex-col shadow-sm border border-gray-200 max-h-[calc(100vh-200px)]"
      >
        <div className="flex justify-between items-center mb-3 px-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors shrink-0"
              title="Drag to reorder column"
              aria-label="Drag to reorder column"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </button>
            <div className="flex-1 relative min-w-0">
              <h3
                tabIndex={0}
                role="button"
                onClick={() => {
                  setEditedTitle(title);
                  setIsEditingTitle(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setEditedTitle(title);
                    setIsEditingTitle(true);
                  }
                }}
                className={`font-bold text-gray-800 cursor-pointer hover:text-gray-900 text-base py-1 px-2 -mx-2 rounded hover:bg-gray-50 transition-colors wrap-break-word focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isEditingTitle ? 'invisible' : 'visible'
                }`}
              >
                {title}
              </h3>
              {isEditingTitle && (
                <input
                  autoFocus
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveTitle();
                    } else if (e.key === "Escape") {
                      setEditedTitle(title);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="absolute top-0 left-0 font-bold text-gray-800 text-base bg-white px-2 py-1 -mx-2 w-full shadow-lg rounded"
                />
              )}
            </div>
          </div>

          <button
            onClick={() => setIsDeleteOpen(true)}
            className="ml-2 p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 focus-visible:ring-offset-0"
            title="Delete column"
            aria-label="Delete column"
          >
            <Icon type="trash" size="sm" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto p-1">
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {children}
          </SortableContext>
          {onAddTask && (
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="w-full px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-left text-sm font-medium transition-colors flex items-center gap-2 border border-transparent hover:border-gray-200"
            >
              <Icon type="plus" size="sm" />
              Add a task
            </button>
          )}
        </div>
      </div>

      {onAddTask && (
        <TaskFormModal
          isOpen={isAddTaskModalOpen}
          onClose={() => setIsAddTaskModalOpen(false)}
          onSubmit={handleAddTask}
          title="Add Task"
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={onDelete}
        title="Delete List"
        message={`Are you sure you want to delete the "${title}" list? All tasks in this list will be lost.`}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
};

export default Column;