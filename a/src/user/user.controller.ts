import { RegisterDTO, LoginDTO, changePassword } from './user.dto';
import { UserService } from './user.service';
import { Controller, Post, Get, Body, Res, Query, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserGuard } from './user.guard';
@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}
  @Post('register')
  async create(@Body() data: register) {
    return await this.UserService.create(data);
  }
  @Post('login')
  async login(@Body() data: login, @Res({ passthrough: true }) response: Response) {
    try {
      const token = await this.UserService.login(data);
      response.cookie('authorization', token, { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true }).send();
    } catch (e) {
      response.status(400).send(e);
    }
  }
  @Get('confirm')
  async confirm(@Query('token') token: string, @Query('password') password: string) {
    return await this.UserService.mailAccountConfirmation(token, password);
  }
  @Post('send-confirmation')
  async sendConfirmation(@Body() data: login) {
    return await this.UserService.sendMailAccountConfirmation(data.email, data.password);
  }
  @UseGuards(UserGuard)
  @Post('change-password')
  async changePassword(@Body() data: changePassword) {
    return await this.UserService.changePassword(data);
  }
  @Get()
  async getAll() {
    return await this.UserService.getAll();
  }
}