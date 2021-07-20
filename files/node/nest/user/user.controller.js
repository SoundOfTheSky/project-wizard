import { UserService } from './user.service';
import { Controller, Post, Get, Body, Res, Query, UseGuards, Dependencies } from '@nestjs/common';
import { UserGuard } from './user.guard';
@Controller('user')
@Dependencies(UserService)
export class UserController {
  constructor(UserService) {
    this.UserService = UserService;
  }
  @Post('register')
  create(@Body() data) {
    return this.UserService.create(data);
  }
  @Post('login')
  login(@Body() data, @Res({ passthrough: true }) response) {
    try {
      const token = this.UserService.login(data);
      response.cookie('authorization', token, { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true }).send();
    } catch (e) {
      response.status(e.status).send(e.response);
    }
  }
  @Get('confirm')
  confirm(@Query('token') token) {
    return this.UserService.mailAccountConfirmation(token);
  }
  @Get('send-confirmation')
  sendConfirmation(@Query('email') email) {
    return this.UserService.sendMailAccountConfirmation(email);
  }
  @Post('change-password')
  changePassword(@Body() data) {
    return this.UserService.changePassword(data);
  }
  @UseGuards(UserGuard)
  @Get()
  getAll() {
    return this.UserService.getAll();
  }
}
