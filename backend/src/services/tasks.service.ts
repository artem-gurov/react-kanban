import { type Task } from "@shared/types";
import { type CreateTaskDTO, mapTaskDocumentToTask } from "src/dtos/task.dto";
import { TaskModel } from "../models/Task.model";
import { ColumnModel } from "../models/Column.model";

export const TasksService = {
  createTask: async (data: CreateTaskDTO): Promise<Task> => {
    const { title, description, dueDate, priority, columnId } = data;
    const dueDateValue = dueDate ? new Date(dueDate) : undefined;

    const session = await TaskModel.startSession();
    session.startTransaction();
    try {
      const task = await TaskModel.create(
        [
          {
            title,
            description,
            dueDate: dueDateValue,
            priority,
          },
        ],
        { session }
      );

      if (!task[0]) {
        throw new Error("Failed to create task");
      }

      await ColumnModel.findByIdAndUpdate(
        columnId,
        { $push: { taskIds: task[0]._id } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return mapTaskDocumentToTask(task[0]);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },
};