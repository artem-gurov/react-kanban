import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import Column from "../components/Column";
import Spinner from "../components/Spinner";
import TaskCard from "../components/TaskCard";
import TaskDetailsModal from "../components/TaskDetailsModal";
import TaskFormModal from "../components/TaskFormModal";
import ConfirmDialog from "../components/ConfirmDialog";
import InputDialog from "../components/InputDialog";
import Icon from "../components/Icon";
import { useBoardContext } from "../context/useBoardContext";
import type { Task } from "@shared/types";

type RouteParams = {
  boardId: string;
  taskId?: string;
}

function Board() {
  const { boardId, taskId } = useParams<RouteParams>();
  const { boards, loadBoard, handleUpdateBoard, handleRemoveBoard, handleAddColumn, handleAddTask, dispatch } = useBoardContext();

  useEffect(() => {
    if (boardId) {
      setIsLoading(true);
      loadBoard(boardId).finally(() => setIsLoading(false));
    }
  }, [boardId, loadBoard]);

  const board = boards.find((b) => b.id === boardId);
  const navigate = useNavigate();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(board?.name || "");
  const [isDeleteBoardOpen, setIsDeleteBoardOpen] = useState(false);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [inputWidth, setInputWidth] = useState(200);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'task' | 'column' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    if (isEditingTitle && measureRef.current) {
      const width = Math.min(measureRef.current.offsetWidth + 48, window.innerWidth - 200);
      setInputWidth(width);
    }
  }, [isEditingTitle, editedTitle]);

  if (!board) {
    return (
      <>
        {isLoading ?
          (<div className="flex flex-1 items-center justify-center h-full" data-testid="board-loading">
            <Spinner size={48} />
          </div>)
          :
          (<div className="flex flex-1 items-center justify-center h-full" data-testid="board-not-found">
            <p className="text-gray-600 text-lg">Board not found.</p>
          </div>)
        }
      </>
    );
  }
console.log(boards);
  const task = taskId ? board.tasks[taskId] : undefined;

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== board.name) {
      handleUpdateBoard(board.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleCloseTaskModal = () => {
    setModalMode('view');
    navigate(`/boards/${board.id}`);
  };

  const handleEditTask = () => {
    setModalMode('edit');
  };

  const handleSaveTask = (taskData: Omit<Task, "id">) => {
    if (task) {
      dispatch({
        type: "UPDATE_TASK",
        payload: { boardId: board.id, taskId: task.id, ...taskData },
      });
      setModalMode('view');
    }
  };

  const handleCancelEdit = () => {
    setModalMode('view');
  };

  const handleDeleteTask = () => {
    if (task) {
      dispatch({
        type: "DELETE_TASK",
        payload: { boardId: board.id, taskId: task.id },
      });
      setModalMode('view');
      navigate(`/boards/${board.id}`);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Determine if dragging a task or column
    const isColumn = board.columns.some((col) => col.id === active.id);
    setActiveType(isColumn ? 'column' : 'task');
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle column reordering during drag
    if (activeType === 'column') {
      const oldIndex = board.columns.findIndex((col) => col.id === activeId);
      const newIndex = board.columns.findIndex((col) => col.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newColumns = arrayMove(board.columns, oldIndex, newIndex);
        dispatch({
          type: "REORDER_COLUMNS",
          payload: {
            boardId: board.id,
            columnIds: newColumns.map((col) => col.id),
          },
        });
      }
      return;
    }

    // Handle task drag over
    if (activeType !== 'task') return;

    // Find which column the active task is in
    const activeColumn = board.columns.find((col) =>
      col.taskIds.includes(activeId)
    );

    // Find which column we're over (could be a column or a task)
    let overColumn = board.columns.find((col) => col.id === overId);
    if (!overColumn) {
      overColumn = board.columns.find((col) => col.taskIds.includes(overId));
    }

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) {
      return;
    }

    // Moving to a different column
    const overIndex = overColumn.taskIds.includes(overId)
      ? overColumn.taskIds.indexOf(overId)
      : overColumn.taskIds.length;

    dispatch({
      type: "MOVE_TASK",
      payload: {
        boardId: board.id,
        taskId: activeId,
        sourceColumnId: activeColumn.id,
        destinationColumnId: overColumn.id,
        destinationIndex: overIndex,
      },
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveType(null);

    if (!over || active.id === over.id) return;

    // Column reordering is handled in handleDragOver for smoother experience
    // Only handle task reordering within the same column here
    if (activeType === 'task') {
      const activeId = active.id as string;
      const overId = over.id as string;

      const activeColumn = board.columns.find((col) =>
        col.taskIds.includes(activeId)
      );

      let overColumn = board.columns.find((col) => col.id === overId);
      if (!overColumn) {
        overColumn = board.columns.find((col) => col.taskIds.includes(overId));
      }

      if (activeColumn && overColumn && activeColumn.id === overColumn.id) {
        const taskIds = activeColumn.taskIds;
        const oldIndex = taskIds.indexOf(activeId);
        const newIndex = taskIds.indexOf(overId);

        if (oldIndex !== newIndex) {
          dispatch({
            type: "MOVE_TASK",
            payload: {
              boardId: board.id,
              taskId: activeId,
              sourceColumnId: activeColumn.id,
              destinationColumnId: overColumn.id,
              destinationIndex: newIndex,
            },
          });
        }
      }
    }
  };

  return (
    <section className="h-full flex flex-col overflow-x-hidden">
      <div className="flex items-center gap-3 mb-6 px-1 pt-1">
        <div className="relative min-w-0 flex-1">
          <h2
            tabIndex={0}
            role="button"
            onClick={() => {
              setEditedTitle(board.name);
              setIsEditingTitle(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setEditedTitle(board.name);
                setIsEditingTitle(true);
              }
            }}
            className={`text-2xl font-bold text-gray-800 cursor-pointer hover:text-gray-600 transition-colors px-3 py-2 rounded hover:bg-white/60 truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isEditingTitle ? 'invisible' : 'visible'
            }`}
          >
            {board.name}
          </h2>
          {isEditingTitle && (
            <>
              <span
                ref={measureRef}
                className="absolute invisible text-2xl font-bold px-3"
                style={{ whiteSpace: 'pre' }}
              >
                {editedTitle || ' '}
              </span>
              <input
                autoFocus
                type="text"
                value={editedTitle}
                onChange={(e) => {
                  setEditedTitle(e.target.value);
                  if (measureRef.current) {
                    setInputWidth(Math.min(measureRef.current.offsetWidth + 48, window.innerWidth - 200));
                  }
                }}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveTitle();
                  }
                  if (e.key === "Escape") {
                    setEditedTitle(board.name);
                    setIsEditingTitle(false);
                  }
                }}
                style={{ width: `${inputWidth}px`, maxWidth: '100%' }}
                className="absolute top-0 left-0 text-2xl font-bold text-gray-800 bg-white px-3 py-2 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}
        </div>
        <button
          onClick={() => setIsDeleteBoardOpen(true)}
          className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-white/60 rounded-lg transition-all focus-visible:ring-offset-0"
          title="Delete board"
          aria-label="Delete board"
        >
          <Icon type="trash" size="md" />
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div data-testid="columns-container" className="flex gap-4 pb-6 pt-1 pr-6 overflow-x-auto flex-1 items-start">
          <SortableContext items={board.columns.map((col) => col.id)} strategy={horizontalListSortingStrategy}>
            {board.columns.map((column) => (
              <Column
                key={column.id}
                columnId={column.id}
                title={column.title}
                taskIds={column.taskIds}
                onRename={(newTitle) =>
                  dispatch({
                    type: "UPDATE_COLUMN",
                    payload: {
                      boardId: board.id,
                      columnId: column.id,
                      title: newTitle,
                    },
                  })
                }
                onDelete={() =>
                  dispatch({
                    type: "DELETE_COLUMN",
                    payload: {
                      boardId: board.id,
                      columnId: column.id,
                    },
                  })
                }
                onAddTask={(task) => handleAddTask(board.id, column.id, task)}
              >
                {column.taskIds.map((taskId) => {
                  const task = board.tasks[taskId];
                  return task ? (
                    <TaskCard key={task.id} taskId={task.id} title={task.title} boardId={board.id} priority={task.priority} />
                  ) : null;
                })}
              </Column>
            ))}
          </SortableContext>

          <button
            data-testid="add-column-button"
            onClick={() => setIsAddColumnOpen(true)}
            className="shrink-0 w-72 p-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-all border-2 border-dashed border-gray-300 hover:border-blue-400 font-semibold flex items-center justify-center gap-2 shadow-sm"
          >
            <Icon type="plus" size="md" />
            Add another list
          </button>
        </div>

        <DragOverlay>
          {activeId && activeType === 'task' ? (
            (() => {
              const task = board.tasks[activeId];
              return task ? (
                <div className="rotate-3 cursor-grabbing">
                  <TaskCard taskId={task.id} title={task.title} boardId={board.id} priority={task.priority} />
                </div>
              ) : null;
            })()
          ) : activeId && activeType === 'column' ? (
            (() => {
              const column = board.columns.find((col) => col.id === activeId);
              return column ? (
                <div className="rotate-2 opacity-50">
                  <Column
                    columnId={column.id}
                    title={column.title}
                    taskIds={column.taskIds}
                    onRename={() => {}}
                    onDelete={() => {}}
                  >
                    {column.taskIds.map((taskId) => {
                      const task = board.tasks[taskId];
                      return task ? (
                        <TaskCard key={task.id} taskId={task.id} title={task.title} boardId={board.id} priority={task.priority} />
                      ) : null;
                    })}
                  </Column>
                </div>
              ) : null;
            })()
          ) : null}
        </DragOverlay>
      </DndContext>

      {task && modalMode === 'view' && (
        <TaskDetailsModal
          key="view-modal"
          task={task}
          onClose={handleCloseTaskModal}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          isOpen={true}
        />
      )}

      {task && modalMode === 'edit' && (
        <TaskFormModal
          key="edit-modal"
          isOpen={true}
          task={task}
          onClose={handleCancelEdit}
          onSubmit={handleSaveTask}
          title="Edit Task"
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteBoardOpen}
        onClose={() => setIsDeleteBoardOpen(false)}
        onConfirm={() => {
          handleRemoveBoard(board.id);
          navigate("/");
        }}
        title="Delete Board"
        message={`Are you sure you want to delete "${board.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      <InputDialog
        isOpen={isAddColumnOpen}
        onClose={() => setIsAddColumnOpen(false)}
        onSubmit={(title) => handleAddColumn(board.id, title)}
        title="Add New List"
        label="List Title"
        placeholder="Enter list title"
        submitText="Add List"
      />
    </section>
  )
}

export default Board;