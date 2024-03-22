import { Request, Response, Router } from 'express';

const routes: Router = Router();

routes.get('/', (req: Request, res: Response) => res.status(200).json('Hello, World!'));

export default routes;
