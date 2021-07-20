import { RegisterDTO, LoginDTO, ChangePasswordDTO } from './user.dto';
import { UserService } from './user.service';
import { Controller, Post, Get, Body, Res, Query, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserGuard } from './user.guard';
@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}
  @Post('register')
  create(@Body() data: RegisterDTO) {
    return this.UserService.create(data);
  }
  @Post('login')
  login(@Body() data: LoginDTO, @Res({ passthrough: true }) response: Response) {
    try {
      const token = this.UserService.login(data);
      response.cookie('authorization', token, { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true }).send();
    } catch (e) {
      response.status(e.status).send(e.response);
    }
  }
  @Get('confirm')
  confirm(@Query('token') token: string) {
    return this.UserService.mailAccountConfirmation(token);
  }
  @Get('send-confirmation')
  sendConfirmation(@Query('email') email: string) {
    return this.UserService.sendMailAccountConfirmation(email);
  }
  @UseGuards(UserGuard)
  @Post('change-password')
  changePassword(@Body() data: ChangePasswordDTO) {
    return this.UserService.changePassword(data);
  }
  @Get()
  getAll() {
    return this.UserService.getAll();
  }
}
