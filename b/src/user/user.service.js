import { Injectable, BadRequestException } from '@nestjs/common';
import { SHA256 } from 'crypto-js';
import { sign, verify } from 'jsonwebtoken';
import { secret } from '../config';

function mutateObjectTrimStrings(data) {
  Object.keys(data).forEach(key => typeof data[key] === 'string' && (data[key] = data[key].trim()));
}
@Injectable()
export class UserService {
  list = [];
  generateAuthToken(user) {
    return sign({ email: user.email, role: user.role }, secret, {
      expiresIn: '14d',
    });
  }
  getAll() {
    return this.list;
  }
  create(data) {
    mutateObjectTrimStrings(data);
    if (typeof data.login !== 'string' || !/^[a-z]{2,24}$/i.test(data.login))
      throw new BadRequestException('Login is invalid');
    if (typeof data.password !== 'string' || !/^\S{6,32}$/.test(data.password))
      throw new BadRequestException('Password is invalid');
    if (
      typeof data.email !== 'string' ||
      !/^[a-z\d][a-z\d.!#$%&'*+-=?^_`{|]{2,30}[a-z\d]@[a-z\d]{2,16}.[a-z]{2,3}$/i.test(data.email)
    )
      throw new BadRequestException('Email is invalid');
    const user = this.list.find(u => u.email === data.email);
    if (user) {
      if (user.role === 'unconfirmed') throw new BadRequestException('Unconfirmed user taken this email');
      throw new BadRequestException('Email is already taken');
    }
    this.list.push({ ...data, password: SHA256(data.password).toString(), role: 'unconfirmed' });
    return true;
  }
  async sendMailAccountConfirmation(email) {
    email = email.trim();
    if (
      typeof email !== 'string' ||
      !/^[a-z\d][a-z\d.!#$%&'*+-=?^_`{|]{2,30}[a-z\d]@[a-z\d]{2,16}.[a-z]{2,3}$/i.test(email)
    )
      throw new BadRequestException('Email is invalid');
    const user = this.list.find(u => u.email === email);
    if (!user) throw new BadRequestException('Email not found');
    // Send mail
    console.log(
      email,
      sign({ email }, secret, {
        expiresIn: '1h',
      }),
    );
  }
  async mailAccountConfirmation(token) {
    try {
      if (!token) throw new BadRequestException('No token');
      const email = verify(token, secret).email;
      const user = this.list.find(u => u.email === email);
      if (!user) throw new BadRequestException('Email not found');
      if (user.role === 'unconfirmed') user.role = 'user';
    } catch {
      throw new BadRequestException('Wrong token');
    }
  }
  async login(data) {
    mutateObjectTrimStrings(data);
    if (typeof data.email !== 'string' && typeof data.login !== 'string')
      throw new BadRequestException('Needs either login or email to be passed');
    if (typeof data.password !== 'string' || !/^\S{6,32}$/.test(data.password))
      throw new BadRequestException('Password is invalid');
    if (
      typeof data.email === 'string' &&
      !/^[a-z\d][a-z\d.!#$%&'*+-=?^_`{|]{2,30}[a-z\d]@[a-z\d]{2,16}.[a-z]{2,3}$/i.test(data.email)
    )
      throw new BadRequestException('Email is invalid');
    if (typeof data.login === 'string' && !/^[a-z]{2,24}$/i.test(data.login))
      throw new BadRequestException('Login is invalid');
    const user = this.list.find(
      u =>
        (data.email ? u.email === data.email : u.login === data.login) &&
        u.password === SHA256(data.password).toString(),
    );
    if (!user) throw new BadRequestException('Not found');
    return this.generateAuthToken({ email: user.email, role: user.role });
  }
  async changePassword(data) {
    mutateObjectTrimStrings(data);
    if (typeof data.email !== 'string' && typeof data.login !== 'string')
      throw new BadRequestException('Needs either login or email to be passed');
    if (
      typeof data.email === 'string' &&
      !/^[a-z\d][a-z\d.!#$%&'*+-=?^_`{|]{2,30}[a-z\d]@[a-z\d]{2,16}.[a-z]{2,3}$/i.test(data.email)
    )
      throw new BadRequestException('Email is invalid');
    if (typeof data.login === 'string' && !/^[a-z]{2,24}$/i.test(data.login))
      throw new BadRequestException('Login is invalid');
    if (!/^\S{6,32}$/.test(data.oldPassword)) throw new BadRequestException('Old password is invalid');
    if (!/^\S{6,32}$/.test(data.newPassword)) throw new BadRequestException('New password is invalid');
    const user = this.list.find(
      u =>
        (data.email ? u.email === data.email : u.login === data.login) &&
        u.password === SHA256(data.oldPassword).toString(),
    );
    if (!user) throw new BadRequestException('Not found');
    user.password = SHA256(data.newPassword).toString();
  }
}
