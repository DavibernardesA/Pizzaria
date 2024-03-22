import 'express-async-errors';
import express from 'express';
import { errorMiddleware } from './config/middlewares/errorMiddleware';
import routes from './routes';
import { AppDataSource } from './data-source';
import { IncomingMessage, Server, ServerResponse } from 'http';

AppDataSource.initialize()
  .then((): Server<typeof IncomingMessage, typeof ServerResponse> => {
    const app: express.Express = express();

    app.use(express.json());
    app.use(routes);

    app.use(errorMiddleware);
    return app.listen(process.env.PORT);
  })
  .catch(err => console.log(err));
