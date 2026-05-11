/*
This file defines the CatModule, which is a NestJS module that encapsulates all components related to cat management in the application. 
The module imports the TypeOrmModule for the Cat entity, registers the CatController and CatService, and provides the CatRepository for database interactions. 
By organizing related components into a module, we can maintain a clean and modular architecture in our NestJS application.
*/
import { Module } from '@nestjs/common';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { Cat } from './entities/cat.entity';
import { CatRepository } from './cat.repository';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cat])],
  controllers: [CatController],
  providers: [CatService, CatRepository],
  exports: [CatRepository],
})
export class CatModule {}
