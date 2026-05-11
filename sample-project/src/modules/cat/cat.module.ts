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
