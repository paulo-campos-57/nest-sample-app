/*
This file is the entry point of the NestJS application. 
It bootstraps the application by creating an instance of the AppModule and configuring global settings such as validation pipes and Swagger documentation.
The bootstrap function initializes the NestJS application, sets up global validation using ValidationPipe, and configures Swagger for API documentation. 
Finally, it starts the application on a specified port and logs the URL for accessing the Swagger documentation.
*/
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Animals API')
    .setDescription('Treinamento em NestJS, API para gerenciamento de animais')
    .setVersion('1.0')
    .addTag('Animals')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server is running on port ${process.env.PORT ?? 3000}\n`);
  console.log(
    `Swagger docs available at http://localhost:${process.env.PORT ?? 3000}/api-docs`,
  );
}
void bootstrap();
