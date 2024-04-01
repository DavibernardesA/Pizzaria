import { Router } from 'express';
import { UserController } from './controllers/userController';
import multer from './middlewares/multer';
import { EmployeeController } from './controllers/employeeController';
import { loggedInEmployee } from './middlewares/loggedInEmployee';
import { loggedInUser } from './middlewares/loggedInUser';
import { validateAdress } from './middlewares/validateAdress';
import { ProductController } from './controllers/productController';
import { AddressController } from './controllers/addressController';

const routes: Router = Router();

const userController: UserController = new UserController();
const employeeController: EmployeeController = new EmployeeController();
const productController: ProductController = new ProductController();
const addressController: AddressController = new AddressController();

//employees
routes.post('/employees', multer.single('profile_image'), employeeController.store);
routes.post('/employees/login', employeeController.login);
routes.get('/employees', loggedInEmployee, employeeController.index);
routes.get('/employees/:id', employeeController.show);
routes.put('/employees/:id', loggedInEmployee, multer.single('profile_image'), employeeController.update);
routes.delete('/employees/:id', loggedInEmployee, employeeController.destroy);

//users
routes.post('/users', multer.single('profile_image'), userController.store);
routes.post('/users/login', userController.login);
routes.get('/users/:id', loggedInUser, userController.show);
routes.put('/users/:id', loggedInUser, multer.single('profile_image'), userController.update);
routes.delete('/users/:id', loggedInUser, userController.destroy);
routes.post('/order/:id', loggedInUser, validateAdress, userController.create_order);

//products
routes.get('/products', productController.index);
routes.get('/products/:id', productController.show);
routes.post('/products', loggedInEmployee, productController.store);
routes.put('/products/:id', loggedInEmployee, productController.update);
routes.delete('/products/:id', loggedInEmployee, productController.destroy);

//address
routes.post('/address/:id', loggedInUser, addressController.store);
routes.get('/address/:id', loggedInUser, addressController.show);
routes.delete('/address/:id', loggedInUser, addressController.destroy);

export default routes;
