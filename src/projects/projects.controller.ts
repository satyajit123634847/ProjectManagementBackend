import { Controller, Get, Post, Body, UseGuards, Req, Param, Patch, Delete } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtStrategy } from 'src/auth/jwt.strategy';


@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtStrategy)
  @Post()
  createProject(@Req() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }

  @UseGuards(JwtStrategy)
  @Get()
  getUserProjects(@Req() req) {
    return this.projectsService.getUserProjects();
  }

  @UseGuards(JwtStrategy)
  @Patch(':id')
  updateProject(@Param('id') projectId: string, @Body() updateData: Partial<CreateProjectDto>) {
    return this.projectsService.updateProject(projectId, updateData);
  }

  @UseGuards(JwtStrategy)
  @Delete(':id')
  deleteProject(@Param('id') projectId: string) {
    return this.projectsService.deleteProject(projectId);
  }
}
