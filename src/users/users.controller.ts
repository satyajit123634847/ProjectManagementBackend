import { Controller, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Patch(':id')
  updateUser(@Param('id') userId: string, @Body() updateData: Partial<{ email: string; name: string; password: string }>) {
    return this.usersService.updateUser(userId, updateData);
  }

  @Delete(':id')
  softDeleteUser(@Param('id') userId: string) {
    return this.usersService.softDeleteUser(userId);
  }
}
