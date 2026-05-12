import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Dog } from './entities/dog.entity';
import { DogRepository } from './dog.repository';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';

@Injectable()
export class DogService {
  constructor(private readonly dogRepository: DogRepository) {}

  async createDog(data: CreateDogDto): Promise<Dog> {
    const dog = await this.dogRepository.createDog(data);

    if (!dog) {
      throw new InternalServerErrorException('Failed to create dog');
    }

    return dog;
  }

  async findAll(): Promise<Dog[] | string> {
    const dogs = await this.dogRepository.findAll();

    if (!dogs) {
      throw new InternalServerErrorException('Failed to find all dog');
    }

    if (dogs.length === 0) {
      return 'No dogs found yet';
    }

    return dogs;
  }

  async findById(id: number): Promise<Dog> {
    const dog = await this.dogRepository.findById(id);

    if (!dog) {
      throw new InternalServerErrorException(
        `Failed to retrieve dog with id ${id}`,
      );
    }

    return dog;
  }

  async update(id: number, data: UpdateDogDto): Promise<Dog> {
    const dog = await this.dogRepository.update(id, data);

    if (dog === null) {
      throw new InternalServerErrorException(
        `Failed to update dog with id ${id}`,
      );
    }

    return dog;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.dogRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }
  }
}
