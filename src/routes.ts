import { Router } from 'express';
import { UserController } from './controllers/userController';
import multer from './middlewares/multer';
import { EmployeeController } from './controllers/employeeController';
import { loggedInEmployee } from './middlewares/loggedInEmployee';
import { loggedInUser } from './middlewares/loggedInUser';

const routes: Router = Router();
const userController: UserController = new UserController();
const employeeController: EmployeeController = new EmployeeController();

//employees
routes.put('/employees', multer.single('profile_image'), employeeController.store);
routes.post('/employees', employeeController.login);
routes.get('/employees', loggedInEmployee, employeeController.index);
routes.get('/employees/:id', employeeController.show);
routes.put('/employees/:id', loggedInEmployee, multer.single('profile_image'), employeeController.update);
routes.delete('/employees/:id', loggedInEmployee, employeeController.destroy);

//users
routes.put('/users', multer.single('profile_image'), userController.store);
routes.post('/users', userController.login);
routes.get('/users/:id', loggedInUser, userController.show);
routes.put('/users/:id', loggedInUser, multer.single('profile_image'), userController.update);
routes.delete('/users/:id', loggedInUser, userController.destroy);

export default routes;
