import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dog } from './entities/dog.entity';
import { Repository } from 'typeorm';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { IDogRepository } from './interfaces/dog-repository.interface';

@Injectable()
export class DogRepository implements IDogRepository {
  constructor(
    @InjectRepository(Dog)
    private readonly repository: Repository<Dog>,
  ) {}

  async createDog(data: CreateDogDto): Promise<Dog> {
    const dog = this.repository.create(data);
    return this.repository.save(dog);
  }

  async findAll(): Promise<Dog[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Dog | null> {
    return this.repository.findOneBy({ id });
  }

  async update(id: number, data: UpdateDogDto): Promise<Dog | null> {
    const dog = await this.findById(id);

    if (!dog) {
      return null;
    }

    Object.assign(Dog, data);

    return this.repository.save(dog);
  }

  async delete(id: number): Promise<boolean> {
    const dog = await this.findById(id);

    if (!dog) {
      return false;
    }

    await this.repository.remove(dog);

    return true;
  }
}
