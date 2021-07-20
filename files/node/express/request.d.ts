import type { Request } from 'express';

export interface Req extends Request {
  authorization: Authorization;
}
export type Authorization = { email: string; role: string };
