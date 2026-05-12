import { Dog } from '../entities/dog.entity';
import { CreateDogDto } from '../dto/create-dog.dto';
import { UpdateDogDto } from '../dto/update-dog.dto';

export interface IDogRepository {
  createDog(data: CreateDogDto): Promise<Dog>;
  findAll(): Promise<Dog[]>;
  findById(id: number): Promise<Dog | null>;
  update(id: number, data: UpdateDogDto): Promise<Dog | null>;
  delete(id: number): Promise<boolean>;
}
