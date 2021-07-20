import { verify } from 'jsonwebtoken';
import { secret } from '@/config';
export default (req, res, next) => {
  try {
    req.authorization = verify(req.cookies.authorization, secret);
    next();
  } catch {
    res.status(400).send("You don't have permission to view this.");
  }
};
