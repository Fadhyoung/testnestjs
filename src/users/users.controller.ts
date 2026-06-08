import { Controller, Get, Post, Body, Param, Delete, NotFoundException, InternalServerErrorException, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse } from '../common/api-response';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return ApiResponse.success(users, 'Users retrieved successfully');
    } catch {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @CurrentUser() user: { id: number; role: Role }) {
    try {
      if (user.role !== Role.ADMIN && user.id !== +id) {
        throw new ForbiddenException('You can only view your own profile');
      }
      const found = await this.usersService.findOne(+id);
      if (!found) throw new NotFoundException(`User with id ${id} not found`);
      return ApiResponse.success(found, 'User retrieved successfully');
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ForbiddenException) throw e;
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateUserDto) {
    try {
      const user = await this.usersService.create(dto);
      return ApiResponse.created(user, 'User created successfully');
    } catch {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
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
