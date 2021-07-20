import { SHA256 } from 'crypto-js';
import { sign, verify } from 'jsonwebtoken';
import { secret } from '@/config';

function mutateObjectTrimStrings(data) {
  Object.keys(data).forEach(key => typeof data[key] === 'string' && (data[key] = data[key].trim()));
}
export const list = [];
export const generateAuthToken = user => sign({ email: user.email, role: user.role }, secret, { expiresIn: '14d' });
export const getAll = () => list;
export const create = data => {
  mutateObjectTrimStrings(data);
  if (typeof data.login !== 'string' || !/^[a-z]{2,24}$/i.test(data.login)) throw new Error('Login is invalid');
  if (typeof data.password !== 'string' || !/^\S{6,32}$/.test(data.password)) throw new Error('Password is invalid');
  if (
    typeof data.email !== 'string' ||
    !/^[a-z\d][a-z\d.!#$%&'*+-=?^_`{|]{2,30}[a-z\d]@[a-z\d]{2,16}.[a-z]{2,3}$/i.test(data.email)
  )
    throw new Error('Email is invalid');
  const user = list.find(u => u.email === data.email);
  if (user) {
    if (user.role === 'unconfirmed') throw new Error('Unconfirmed user taken this email');
    throw new Error('Email is already taken');
  }
  list.push({ ...data, password: SHA256(data.password).toString(), role: 'unconfirmed' });
  return true;
};
export const sendMailAccountConfirmation = email => {
  email = email.trim();
  if (
    typeof email !== 'string' ||
    !/^[a-z\d][a-z\d.!#$%&'*+-=?^_`{|]{2,30}[a-z\d]@[a-z\d]{2,16}.[a-z]{2,3}$/i.test(email)
  )
    throw new Error('Email is invalid');
  const user = list.find(u => u.email === email);
  if (!user) throw new Error('Email not found');
  // Send mail
  console.log(
    email,
    sign({ email }, secret, {
      expiresIn: '1h',
    }),
  );
};
export function mailAccountConfirmation(token) {
  try {
    if (!token) throw new Error('No token');
    const email = verify(token, secret).email;
    const user = list.find(u => u.email === email);
    if (!user) throw new Error('Email not found');
    if (user.role === 'unconfirmed') user.role = 'user';
  } catch {
    throw new Error('Wrong token');
  }
}
export function login(data) {
  mutateObjectTrimStrings(data);
  if (typeof data.email !== 'string' && typeof data.login !== 'string')
    throw new Error('Needs either login or email to be passed');
  if (typeof data.password !== 'string' || !/^\S{6,32}$/.test(data.password)) throw new Error('Password is invalid');
  if (
    typeof data.email === 'string' &&
    !/^[a-z\d][a-z\d.!#$%&'*+-=?^_`{|]{2,30}[a-z\d]@[a-z\d]{2,16}.[a-z]{2,3}$/i.test(data.email)
  )
    throw new Error('Email is invalid');
  if (typeof data.login === 'string' && !/^[a-z]{2,24}$/i.test(data.login)) throw new Error('Login is invalid');
  const user = list.find(
    u =>
      (data.email ? u.email === data.email : u.login === data.login) && u.password === SHA256(data.password).toString(),
  );
  if (!user) throw new Error('Not found');
  return generateAuthToken({ email: user.email, role: user.role });
}
export function changePassword(data) {
  mutateObjectTrimStrings(data);
  if (typeof data.email !== 'string' && typeof data.login !== 'string')
    throw new Error('Needs either login or email to be passed');
  if (
    typeof data.email === 'string' &&
    !/^[a-z\d][a-z\d.!#$%&'*+-=?^_`{|]{2,30}[a-z\d]@[a-z\d]{2,16}.[a-z]{2,3}$/i.test(data.email)
  )
    throw new Error('Email is invalid');
  if (typeof data.login === 'string' && !/^[a-z]{2,24}$/i.test(data.login)) throw new Error('Login is invalid');
  if (!/^\S{6,32}$/.test(data.oldPassword)) throw new Error('Old password is invalid');
  if (!/^\S{6,32}$/.test(data.newPassword)) throw new Error('New password is invalid');
  const user = list.find(
    u =>
      (data.email ? u.email === data.email : u.login === data.login) &&
      u.password === SHA256(data.oldPassword).toString(),
  );
  if (!user) throw new Error('Not found');
  user.password = SHA256(data.newPassword).toString();
}
