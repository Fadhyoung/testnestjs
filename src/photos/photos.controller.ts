import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PhotosService } from './photos.service';
import { Photo } from './photo.entity';
import { ApiResponse } from '../common/api-response';

@UseGuards(AuthGuard('jwt'))
@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Get()
  async findAll() {
    try {
      const photos = await this.photosService.findAll();
      return ApiResponse.success(photos, 'Photos retrieved successfully');
    } catch {
      throw new InternalServerErrorException('Failed to retrieve photos');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const photo = await this.photosService.findOne(+id);
      if (!photo) throw new NotFoundException(`Photo with id ${id} not found`);
      return ApiResponse.success(photo, 'Photo retrieved successfully');
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Failed to retrieve photo');
    }
  }

  @Post()
  async create(@Body() photo: Partial<Photo>) {
    try {
      const created = await this.photosService.create(photo);
      return ApiResponse.created(created, 'Photo created successfully');
    } catch {
      throw new InternalServerErrorException('Failed to create photo');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() photo: Partial<Photo>) {
    try {
      const updated = await this.photosService.update(+id, photo);
      if (!updated) throw new NotFoundException(`Photo with id ${id} not found`);
      return ApiResponse.updated(updated, 'Photo updated successfully');
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Failed to update photo');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const photo = await this.photosService.findOne(+id);
      if (!photo) throw new NotFoundException(`Photo with id ${id} not found`);
      await this.photosService.remove(+id);
      return ApiResponse.deleted(`Photo with id ${id} deleted successfully`);
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Failed to delete photo');
    }
  }
}
