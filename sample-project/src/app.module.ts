import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './modules/cat/cat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatService } from './services/cat/cat.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sqlite.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CatModule,
  ],
  controllers: [AppController],
  providers: [AppService, CatService],
})
export class AppModule {}
