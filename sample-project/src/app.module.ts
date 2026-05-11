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
import { LoggerMiddleware } from './middleware/logger.middleware';

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
  providers: [CatService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
