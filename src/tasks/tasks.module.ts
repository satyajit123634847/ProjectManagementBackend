import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, TaskSchema } from './schemas/task.schema'; // Import Task schema
import { UsersModule } from '../users/users.module'; // Import UsersModule if needed

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]), // Register Task model
    UsersModule, // Import UsersModule if required
  ],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
