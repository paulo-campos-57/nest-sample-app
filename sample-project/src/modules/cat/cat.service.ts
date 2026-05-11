import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CatRepository } from './cat.repository';
import { Cat } from './entities/cat.entity';

@Injectable()
export class CatService {
  constructor(private readonly catRepository: CatRepository) {}

  async create(data: Partial<Cat>): Promise<Cat> {
    const cat = await this.catRepository.create(data);
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
}
