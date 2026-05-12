import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dog } from './entities/dog.entity';
import { DogController } from './dog.controller';
import { DogService } from './dog.service';
import { DogRepository } from './dog.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Dog])],
  controllers: [DogController],
  providers: [DogService, DogRepository],
  exports: [DogRepository],
})
export class DogModule {}
