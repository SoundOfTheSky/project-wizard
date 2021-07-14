import { verify } from 'jsonwebtoken';
import { secret } from '@/config';
import type { NextFunction, Request, Response } from 'express';
import type { Authorization, Req } from '@/request';
export default (req: Request, res: Response, next: NextFunction) => {
  try {
    (req as Req).authorization = verify(req.cookies.authorization, secret) as Authorization;
    next();
  } catch {
    res.status(400).send("You don't have permission to view this.");
  }
};
