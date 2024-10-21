import { Controller, Get, Post, Body, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtStrategy)
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @UseGuards(JwtStrategy)
  @Get('')
  getProjectTasks() {
    return this.tasksService.getProjectTasks();
  }

  @UseGuards(JwtStrategy)
  @Patch(':id')
  updateTask(@Param('id') taskId: string, @Body() updateData: Partial<CreateTaskDto>) {
    return this.tasksService.updateTask(taskId, updateData);
  }

  @UseGuards(JwtStrategy)
  @Delete(':id')
  deleteTask(@Param('id') taskId: string) {
    return this.tasksService.deleteTask(taskId);
  }
}
