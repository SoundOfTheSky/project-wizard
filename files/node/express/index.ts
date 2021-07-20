import express from 'express';
import path from 'path';
import type { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import Router from './router';
import Throttling from './middlewares/throttling';
function startServer({ port }: { port: number }) {
  const app = express();
  app.use(express.static(path.join(__dirname, 'static')));
  app.use(Throttling);
  app.use(errorMiddleware);
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use('/api', Router);
  return new Promise(r => {
    const server = app.listen(port, () => {
      console.log('Listening on port ' + port);
      r(server);
    });
  });

  function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) next(error);
    else console.error(error);
    res.status(500).json({
      message: error.message,
      ...(process.env.NODE_ENV === 'production' ? null : { stack: error.stack }),
    });
  }
}
startServer({ port: 3000 });
export { startServer };
