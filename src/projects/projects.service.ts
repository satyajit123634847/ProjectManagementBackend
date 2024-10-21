import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}

  async createProject(createProjectDto: CreateProjectDto): Promise<{ status: boolean; message: string; data: Project }> {
    try {
      const newProject = new this.projectModel({ ...createProjectDto });
      const savedProject = await newProject.save();
      return {
        status: true,
        message: 'Project created successfully',
        data: savedProject
      };
    } catch (error) {
        console.log("error:", error)
      if (error.code === 11000) {
        throw new ConflictException('A project with this name already exists');
      }
      throw new InternalServerErrorException('Error creating project');
    }
  }

  async getUserProjects(): Promise<{ status: boolean; message: string; data: Project[] }> {
    try {
      const projects = await this.projectModel.find({ status: true }).exec();
      return {
        status: true,
        message: 'Projects retrieved successfully',
        data: projects
      };
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving projects');
    }
  }

  async updateProject(projectId: string, updateData: Partial<CreateProjectDto>): Promise<{ status: boolean; message: string; data: Project }> {
    try {
      const updatedProject = await this.projectModel.findByIdAndUpdate(projectId, updateData, { new: true }).exec();
      if (!updatedProject) {
        throw new NotFoundException(`Project with id ${projectId} not found`);
      }
      return {
        status: true,
        message: 'Project updated successfully',
        data: updatedProject
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating project');
    }
  }

  async deleteProject(projectId: string): Promise<{ status: boolean; message: string }> {
    try {
      const result = await this.projectModel.findByIdAndUpdate(projectId, { status: false }, { new: true }).exec();
      if (!result) {
        throw new NotFoundException(`Project with id ${projectId} not found`);
      }
      return {
        status: true,
        message: 'Project deleted successfully'
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting project');
    }
  }
}