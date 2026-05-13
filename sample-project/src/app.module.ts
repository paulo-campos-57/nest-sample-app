/*
This file defines the AppModule, which is the root module of the NestJS application. 
It imports the CatModule, which contains all components related to cat management, and sets up the TypeORM configuration for connecting to a SQLite database. 
The AppModule also implements the NestModule interface to configure middleware, applying the LoggerMiddleware to all routes in the application. 
This setup allows for a modular architecture where different features of the application can be organized into separate modules, 
while still maintaining a centralized configuration in the AppModule.
*/
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CatModule } from './modules/cat/cat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatService } from './modules/cat/cat.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { DogModule } from './modules/dog/dog.module';
import { DogService } from './modules/dog/dog.service';
import { CommonModule } from './common/common.module';
import { WhatsAppService } from './common/services/whatsapp.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sqlite.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CatModule,
    DogModule,
    CommonModule,
  ],
  providers: [CatService, DogService, WhatsAppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
