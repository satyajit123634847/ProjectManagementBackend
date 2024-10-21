import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Project } from '../../projects/schemas/project.schema';
import { User } from '../../users/schemas/user.schema';

@Schema()
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  assignee: User;

  @Prop({ required: true, enum: ['Low', 'Medium', 'High'] })
  priority: string;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ required: true, enum: ['To Do', 'In Progress', 'Completed'] })
  taskStatus: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Project;

  @Prop({ default: true })
  status: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
