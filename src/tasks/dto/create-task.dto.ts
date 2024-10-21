export class CreateTaskDto {
    readonly title: string;
    readonly description?: string;
    readonly assignee: string; // user ID from the users model
    readonly priority: 'Low' | 'Medium' | 'High';
    readonly dueDate: Date;
    readonly taskStatus: 'To Do' | 'In Progress' | 'Completed';
    readonly project: string;
  }
  