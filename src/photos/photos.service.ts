import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
  ) {}

  findAll(): Promise<Photo[]> {
    return this.photosRepository.find();
  }

  findOne(id: number): Promise<Photo | null> {
    return this.photosRepository.findOneBy({ id });
  }

  create(photo: Partial<Photo>): Promise<Photo> {
    return this.photosRepository.save(photo);
  }

  async update(id: number, photo: Partial<Photo>): Promise<Photo | null> {
    await this.photosRepository.update(id, photo);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.photosRepository.softDelete(id);
  }
}
