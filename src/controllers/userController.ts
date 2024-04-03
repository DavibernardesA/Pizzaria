import { Request, Response } from 'express';
import { userRepository } from '../repositories/userRepository';
import { BadRequestError, InvalidFormatError, NotFoundError, UnauthorizedError } from '../helpers/api-error';
import chat from '../chat/statusMessage';
import { User } from '../entities/User';
import { s3Client } from '../services/aws';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import deleteImage from '../services/deleteImage';
import { employeeRepository } from '../repositories/employeeRepository';
import fs from 'fs/promises';
import Handlebars from 'handlebars';
import { send } from '../utils/emailSender';
import { LoginUser } from '../DTO/Login';
import { envChecker } from '../utils/envChecker';
import { updateImage } from '../services/updateImage';
import { fileUpload } from '../services/imageUpload';
import { productOrderRepository } from '../repositories/productOrderRepository';
import { orderRepository } from '../repositories/orderRepository';

export class UserController {
  async store(req: Request, res: Response): Promise<Response<User>> {
    const { name, email, password } = req.body;
    let avatar: Express.Multer.File | undefined = req.file;

    if (!name || !email || !password) {
      throw new InvalidFormatError(chat.error400);
    }

    const existingEmployee = await employeeRepository.findByEmail(email);
    const existingUser = await userRepository.findByEmail(email);

    if (existingEmployee.length > 0 || existingUser.length > 0) {
      throw new InvalidFormatError(chat.error400);
    }

    //file upload
    if (avatar) {
      const newImage = await fileUpload(name, 'profiles/users', avatar);

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser: Omit<User, 'id'> = {
        name,
        email,
        password: encryptedPassword,
        avatar: newImage,
        orders: []
      };

      const savedUser: User = await userRepository.create(newUser);
      await userRepository.save(savedUser);

      //send email
      const file: Buffer = await fs.readFile('src/templates/registrationEmail.html');

      const compiler: HandlebarsTemplateDelegate<any> = Handlebars.compile(file.toString());

      const htmlMail = compiler({
        nameUser: name
      });

      send(`${name} <${email}>`, 'Thank You for Creating an Account', htmlMail);

      return res.status(201).json(savedUser);
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser: Omit<User, 'id'> = {
        name,
        email,
        password: encryptedPassword,
        avatar: '',
        orders: []
      };

      const savedUser: User = await userRepository.create(newUser);
      await userRepository.save(savedUser);

      //send email
      const file: Buffer = await fs.readFile('src/templates/registrationEmail.html');

      const compiler: HandlebarsTemplateDelegate<any> = Handlebars.compile(file.toString());

      const htmlMail = compiler({
        nameUser: name
      });

      send(`${name} <${email}>`, 'Thank You for Creating an Account', htmlMail);

      return res.status(201).json();
    }
  }

  async show(req: Request, res: Response): Promise<Response<User>> {
    const { id } = req.params;

    const userId: number = parseInt(id);

    if (!id || isNaN(userId)) {
      throw new BadRequestError(chat.error400);
    }

    const user: User | null = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError(chat.error404);
    }

    return res.status(200).json(user);
  }

  async login(req: Request, res: Response): Promise<Response<LoginUser>> {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new InvalidFormatError(chat.error400);
    }

    const users: User[] = await userRepository.findByEmail(String(email));

    if (users.length < 1) {
      throw new NotFoundError(chat.error400);
    }

    const user: User = users[0];

    const correctPassword: boolean = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      throw new InvalidFormatError(chat.error400);
    }

    const jwtPass: string | undefined = envChecker(process.env.JWT_PASS);

    const token = jwt.sign({ id: user.id }, jwtPass, { expiresIn: '8h' });

    const { password: _, ...userData } = user;

    return res.status(200).json({ user: userData, token });
  }

  async update(req: Request, res: Response): Promise<Response<void>> {
    const { name, email, password } = req.body;
    let avatar: Express.Multer.File | undefined = req.file;
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new InvalidFormatError(chat.error400);
    }

    const userId: number = parseInt(id);

    if (!id || isNaN(userId)) {
      throw new InvalidFormatError(chat.error404);
    }

    const user: User | null = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError(chat.error404);
    }

    if (avatar) {
      const newImage = await updateImage(user, 'profiles/users', avatar);

      const userData: Partial<User> = {
        name: name || user.name,
        email: email || user.email,
        password: password || user.password,
        avatar: newImage
      };

      Object.assign(user, userData);

      if (userId !== user.id) {
        throw new UnauthorizedError(chat.error401);
      }

      await userRepository.save(user);

      return res.status(200).json();
    }

    const userData: Partial<User> = {
      name: name || user.name,
      email: email || user.email,
      password: password || user.password
    };

    Object.assign(user, userData);

    if (userId !== user.id) {
      throw new UnauthorizedError(chat.error401);
    }

    await userRepository.save(user);

    return res.status(200).json();
  }

  async destroy(req: Request, res: Response): Promise<Response<void>> {
    const { id } = req.params;

    const userId: number = parseInt(id);

    if (!id || isNaN(userId)) {
      throw new InvalidFormatError(chat.error400);
    }

    const user: User | null = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError(chat.error404);
    }

    const avatar: string | undefined = user.avatar;

    if (avatar) {
      await deleteImage(avatar, 'profiles/users');
    }

    if (user.id === req.user.id) {
      await userRepository.delete(user);
    } else {
      throw new UnauthorizedError(chat.error401);
    }

    return res.status(203).json();
  }

  async create_order(req: Request, res: Response) {
    const { observation, products } = req.body;
    const { id } = req.params;

    const userId: number | undefined = parseInt(id);

    if (!userId || isNaN(userId)) {
      throw new InvalidFormatError(chat.error400);
    }

    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError(chat.error404);
    }

    if (!observation || !products || !Array.isArray(products) || products.length === 0) {
      throw new InvalidFormatError(chat.error400);
    }

    let totalValue = 0;

    for (const product of products) {
      if (!product.id || !product.quantity || !product.value) {
        throw new InvalidFormatError(chat.error400);
      }

      const productOrder = productOrderRepository.create({
        product_id: product.id,
        quantity: product.quantity,
        value: product.value
      });

      totalValue += product.quantity * product.value;

      await productOrderRepository.save(productOrder);
    }

    const order = orderRepository.create({
      observation,
      total_value: totalValue,
      user
    });

    await orderRepository.save(order);

    const orderWithUser = await orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .where('order.id = :orderId', { orderId: order.id })
      .getOne();

    return res.status(201).json(orderWithUser);
  }
}
