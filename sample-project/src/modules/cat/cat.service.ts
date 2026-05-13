/*
This file defines the CatService class, which contains the business logic for managing cats in the application.
The service interacts with the CatRepository to perform CRUD operations on Cat entities.
Each method in the service handles a specific operation, such as creating a new cat, retrieving all cats,
finding a cat by ID, updating a cat's information, and deleting a cat.
The service throws HTTP exceptions when an operation fails or when a cat is not found.
These exceptions are handled centrally by the global exception filter, which formats
the error responses in a consistent way across the entire application.
*/
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

  async findAll(): Promise<Cat[]> {
    return this.catRepository.findAll();
  }

  async findById(id: number): Promise<Cat> {
    const cat = await this.catRepository.findById(id);

    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }

    return cat;
  }

  async update(id: number, data: UpdateCatDto): Promise<Cat> {
    const cat = await this.catRepository.update(id, data);

    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
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
