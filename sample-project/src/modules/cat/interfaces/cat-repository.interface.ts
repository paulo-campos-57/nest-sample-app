/*
This file defines the ICatRepository interface, which represents the
contract that any Cat repository implementation must follow.

The interface declares the methods required to perform CRUD operations
on Cat entities, including creating, retrieving, updating, and deleting
records from the database.

By depending on this interface instead of a concrete class, the service
layer becomes decoupled from the specific persistence implementation.
This makes it easier to replace the repository (for example, switching
from TypeORM to Prisma or to an in-memory repository for testing)
without changing the business logic.

The CatRepository class implements this interface, and the CatService
uses this contract to interact with the data layer in a consistent and
type-safe way.
*/
import { CreateCatDto } from '../dto/create-cat.dto';
import { UpdateCatDto } from '../dto/update-cat.dto';
import { Cat } from '../entities/cat.entity';

export interface ICatRepository {
  createCat(data: CreateCatDto): Promise<Cat>;
  findAll(): Promise<Cat[]>;
  findById(id: number): Promise<Cat | null>;
  update(id: number, data: UpdateCatDto): Promise<Cat | null>;
  delete(id: number): Promise<boolean>;
}
