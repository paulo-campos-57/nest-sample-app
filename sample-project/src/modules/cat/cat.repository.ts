import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cat } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Injectable()
export class CatRepository {
  constructor(
    @InjectRepository(Cat)
    private readonly repository: Repository<Cat>,
  ) {}

  async createCat(data: CreateCatDto): Promise<Cat> {
    const cat = this.repository.create(data);
    return this.repository.save(cat);
  }

  async findAll(): Promise<Cat[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Cat | null> {
    return this.repository.findOneBy({ id });
  }

  async update(id: number, data: UpdateCatDto): Promise<Cat | null> {
    const cat = await this.findById(id);

    if (!cat) {
      return null;
    }

    Object.assign(cat, data);

    return this.repository.save(cat);
  }

  async delete(id: number): Promise<boolean> {
    const cat = await this.findById(id);

    if (!cat) {
      return false;
    }

    await this.repository.remove(cat);

    return true;
  }
}
