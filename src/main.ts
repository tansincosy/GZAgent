import { NestBootFactory } from '@nestboot/core';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const bootstrap = async () =>
  NestBootFactory.create(await NestFactory.create(AppModule));
bootstrap();
