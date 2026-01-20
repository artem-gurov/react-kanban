import { Link } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Priority } from "@shared/types";
import { getPriorityColors } from "../utils/priorityColors";

type TaskCardProps = {
  taskId: string;
  title: string;
  boardId: string;
  priority?: Priority;
}

const TaskCard = ({ taskId, title, boardId, priority }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: taskId,
    data: {
      type: 'task',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <Link
        to={`/boards/${boardId}/tasks/${taskId}`}
        data-testid="task-card"
        className={`block p-3 rounded-lg shadow-sm hover:shadow-md transition-all text-gray-800 text-sm border ${getPriorityColors(priority).card}`}
        onClick={(e) => {
          if (isDragging) {
            e.preventDefault();
          }
        }}
      >
        <div className="font-medium leading-snug wrap-break-word">{title}</div>
      </Link>
    </div>
  );
};

export default TaskCard;