import { Controller, Get, Post, Body, Param, Delete, NotFoundException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse } from '../common/api-response';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return ApiResponse.success(users, 'Users retrieved successfully');
    } catch {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(+id);
      if (!user) throw new NotFoundException(`User with id ${id} not found`);
      return ApiResponse.success(user, 'User retrieved successfully');
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    try {
      const user = await this.usersService.create(dto);
      return ApiResponse.created(user, 'User created successfully');
    } catch {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(+id);
      if (!user) throw new NotFoundException(`User with id ${id} not found`);
      await this.usersService.remove(+id);
      return ApiResponse.deleted(`User with id ${id} deleted successfully`);
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
