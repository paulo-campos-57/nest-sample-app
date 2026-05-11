import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CatRepository } from './cat.repository';

import { Cat } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Injectable()
export class CatService {
  constructor(private readonly catRepository: CatRepository) {}

  async create(data: CreateCatDto): Promise<Cat> {
    const cat = await this.catRepository.createCat(data);
    if (!cat) {
      throw new InternalServerErrorException('Failed to create cat');
    }
    return cat;
  }

  async findAll(): Promise<Cat[] | string> {
    const cats = await this.catRepository.findAll();
    if (!cats) {
      throw new InternalServerErrorException('Failed to retrieve cats');
    }

    if (cats.length === 0) {
      return 'No cats found yet';
    }
    return cats;
  }

  async findById(id: number): Promise<Cat> {
    const cat = await this.catRepository.findById(id);
    if (!cat) {
      throw new InternalServerErrorException(
        `Failed to retrieve cat with id ${id}`,
      );
    }
    return cat;
  }

  async update(id: number, data: UpdateCatDto): Promise<Cat | null> {
    const cat = await this.catRepository.update(id, data);
    if (cat === null) {
      throw new InternalServerErrorException(
        `Failed to update cat with id ${id}`,
      );
    }
    return cat;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.catRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }
  }
}
