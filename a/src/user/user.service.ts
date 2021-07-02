import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SHA256 } from 'crypto-js';
import { Model } from 'mongoose';
import { register, login, changePassword } from './user.dto';
import { UserDocument, User } from './user.schema';
import { sign, verify } from 'jsonwebtoken';
import * as mail from '../mail';
import config from '../config';
import { mutateObjectTrimStrings, v } from '../utils';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  generateAuthToken(user: { email: string; role: string }) {
    return sign({ email: user.email, role: user.role }, config.secret, {
      expiresIn: '14d',
    });
  }
  async getAll() {
    return await this.userModel.find();
  }
  async create(data: register) {
    mutateObjectTrimStrings(data);
    if (!v(/^[А-ЯA-ZЁ][а-яa-zё]{2,23}$/u, data.name)) throw new BadRequestException('Name is invalid');
    if (!v(/^[А-ЯA-ZЁ][а-яa-zё]{2,23}$/u, data.surname)) throw new BadRequestException('Surname is invalid');
    if (!v(/^\S{6,32}$/, data.password)) throw new BadRequestException('Password is invalid');
    if (!v(/^[a-z\d][a-z\d.!#$%&'*+-=?^_`{|]{2,30}[a-z\d]@[a-z\d]{2,16}.[a-z]{2,3}$/i, data.email))
      throw new BadRequestException('Email is invalid');
    const user = await this.userModel.findOne({ email: data.email }, 'role');
    if (user) {
      if (user.role === 'unconfirmed') throw new BadRequestException('Unconfirmed user taken this email');
      throw new BadRequestException('Email is already taken');
    }
    await new this.userModel({ ...data, password: SHA256(data.password).toString() }).save();
    return true;
  }
  async sendMailAccountConfirmation(email: string, password?: string) {
    email = email.trim();
    password = password === undefined ? undefined : password.trim();
    if (!v(/^[a-z\d][a-z\d.!#$%&'*+-=?^_`{|]{2,30}[a-z\d]@[a-z\d]{2,16}.[a-z]{2,3}$/i, email))
      throw new BadRequestException('Email is invalid');
    if (!v(/^\S{6,32}$/, password)) throw new BadRequestException('Password is invalid');
    const user = await this.userModel.findOne({ email }, 'name surname');
    if (!user) throw new BadRequestException('Email not found');
    mail.sendConfirmation(
      email,
      `${user.name} ${user.surname}`,
      sign({ email }, config.secret, {
        expiresIn: '1h',
      }),
      password,
    );
  }
  async mailAccountConfirmation(token: string, password: string) {
    password = password === undefined ? undefined : password.trim();
    if (!v(/^\S{6,32}$/, password, 'string', true)) throw new BadRequestException('Password is invalid');
    try {
      const email = (verify(token, config.secret) as { email: string }).email;
      const user = await this.userModel.findOne({ email }, 'role');
      if (!user) throw new BadRequestException('Email not found');
      if (user.role === 'unconfirmed') user.role = 'user';
      if (password) user.password = SHA256(password).toString();
      await user.save();
    } catch {
      throw new BadRequestException('Wrong token');
    }
  }
  async login(data: login) {
    mutateObjectTrimStrings(data);
    if (!v(/^\S{6,32}$/, data.password)) throw new BadRequestException('Password is invalid');
    if (!v(/^[a-z\d][a-z\d.!#$%&'*+-=?^_`{|]{2,30}[a-z\d]@[a-z\d]{2,16}.[a-z]{2,3}$/i, data.email))
      throw new BadRequestException('Email is invalid');
    const user = await this.userModel.findOne(
      { email: data.email, password: SHA256(data.password).toString() },
      'role',
    );
    if (!user) throw new BadRequestException('Not found');
    return this.generateAuthToken({ email: data.email, role: user.role });
  }
  async changePassword(data: changePassword) {
    mutateObjectTrimStrings(data);
    if (!v(/^[a-z\d][a-z\d.!#$%&'*+-=?^_`{|]{2,30}[a-z\d]@[a-z\d]{2,16}.[a-z]{2,3}$/i, data.email))
      throw new BadRequestException('Email is invalid');
    if (!v(/^\S{6,32}$/, data.oldPassword)) throw new BadRequestException('Old password is invalid');
    if (!v(/^\S{6,32}$/, data.newPassword)) throw new BadRequestException('New password is invalid');
    const user = await this.userModel.findOne(
      { email: data.email, password: SHA256(data.oldPassword).toString() },
      'password',
    );
    if (!user) throw new BadRequestException('Not found');
    user.password = SHA256(data.newPassword).toString();
    await user.save();
  }
}
