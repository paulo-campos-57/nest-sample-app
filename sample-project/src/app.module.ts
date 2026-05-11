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
