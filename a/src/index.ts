import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { GlobalGuard } from './global.guard';
import imagemin from 'imagemin';
import imageminGifsicle from 'imagemin-gifsicle';
async function bootstrap() { 
  console.log(imagemin, imageminGifsicle);
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(cookieParser());
  // Anti ddos
  app.useGlobalGuards(new GlobalGuard());
  await app.listen(3000);
  console.log('working!');
}
bootstrap();
export const createApp = NestFactory.create(AppModule);
