import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { GlobalGuard } from './global.guard';
import * as gifsicle from 'imagemin-gifsicle';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(cookieParser());
  // Anti ddos
  app.useGlobalGuards(new GlobalGuard());
  await app.listen(3000);
  console.log(gifsicle);
}
bootstrap();
