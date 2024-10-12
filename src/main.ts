import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors())
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
  .setTitle('Task Management API')
  .setDescription('API endpoints for TMS')
  .setVersion('1.0')
  .addBearerAuth()
  .build()
 
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe);
  await app.listen(3000);
}
bootstrap();
