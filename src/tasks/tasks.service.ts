import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<{ status: boolean; message: string; data: Task }> {
    try {
      const newTask = new this.taskModel(createTaskDto);
      const savedTask = await newTask.save();
      return {
        status: true,
        message: 'Task created successfully',
        data: savedTask
      };
    } catch (error) {
      console.log("error", error)
      throw new InternalServerErrorException('Error creating task');
    }
  }

  async getProjectTasks(): Promise<{ status: boolean; message: string; data: Task[] }> {
    try {
      const tasks = await this.taskModel.find({  status: true }).populate(["assignee","project"]).exec();
      return {
        status: true,
        message: 'Tasks retrieved successfully',
        data: tasks
      };
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving tasks');
    }
  }

  async updateTask(taskId: string, updateData: Partial<CreateTaskDto>): Promise<{ status: boolean; message: string; data: Task }> {
    try {
      const updatedTask = await this.taskModel.findByIdAndUpdate(taskId, updateData, { new: true }).exec();
      if (!updatedTask) {
        throw new NotFoundException(`Task with id ${taskId} not found`);
      }
      return {
        status: true,
        message: 'Task updated successfully',
        data: updatedTask
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating task');
    }
  }

  async deleteTask(taskId: string): Promise<{ status: boolean; message: string }> {
    try {
      const result = await this.taskModel.findByIdAndUpdate(taskId, { status: false }, { new: true }).exec();
      if (!result) {
        throw new NotFoundException(`Task with id ${taskId} not found`);
      }
      return {
        status: true,
        message: 'Task deleted successfully'
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting task');
    }
  }
}
