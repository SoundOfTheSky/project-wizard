import { Controller, Get, Dependencies, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
@Dependencies(AppService)
export class AppController {
  constructor(appService) {
    this.appService = appService;
  }

  @Get()
  getHello(@Body() data) {
    console.log(data);
    return this.appService.getHello();
  }
}
