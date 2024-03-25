import { Request, Response } from 'express';
import { userRepository } from '../repositories/userRepository';
import { BadRequestError, InvalidFormatError, NotFoundError, ServerError, UnauthorizedError } from '../helpers/api-error';
import chat from '../chat/statusMessage';
import { User } from '../entities/User';
import { s3Client } from '../services/aws';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import deleteImage from '../services/deleteImage';
import { employeeRepository } from '../repositories/employeeRepository';
import { RequestWhitEntity } from '../interfaces/RequestWhitEntity';
import fs from 'fs/promises';
import Handlebars from 'handlebars';
import { send } from '../utils/emailSender';

export class UserController {
  async store(req: Request, res: Response) {
    const { name, email, password } = req.body;
    let avatar: Express.Multer.File | undefined = req.file;

    if (!name || !email || !password) {
      throw new InvalidFormatError(chat.error400);
    }

    const existingEmployee = await employeeRepository.findByEmail(email);
    const existingUser = await userRepository.findByEmail(email);

    if (existingEmployee.length > 1 && existingUser.length > 1) {
      throw new InvalidFormatError(chat.error400);
    }

    //file upload
    if (avatar) {
      const Key: string = `profiles/users/${encodeURIComponent(name)}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.KEY_NAME_BUCKET,
          Key,
          Body: avatar.buffer,
          ContentType: avatar.mimetype
        })
      );

      const s3URL: string = `http://${process.env.ENDPOINT_BUCKET}/${Key}`;

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser: Omit<User, 'id'> = {
        name,
        email,
        password: encryptedPassword,
        avatar: s3URL,
        adress: []
      };
      const savedUser: User = userRepository.create(newUser);
      await userRepository.save(savedUser);

      //send email
      const file: Buffer = await fs.readFile('src/templates/registrationEmail.html');

      const compiler: HandlebarsTemplateDelegate<any> = Handlebars.compile(file.toString());

      const htmlMail = compiler({
        nameUser: name
      });

      send(`${name} <${email}>`, 'Thank You for Creating an Account', htmlMail);

      return res.status(201).json({ ...newUser });
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser: Omit<User, 'id'> = {
        name,
        email,
        password: encryptedPassword,
        avatar: '',
        adress: []
      };
      const savedUser: User = userRepository.create(newUser);
      await userRepository.save(savedUser);

      //send email
      const file: Buffer = await fs.readFile('src/templates/registrationEmail.html');

      const compiler: HandlebarsTemplateDelegate<any> = Handlebars.compile(file.toString());

      const htmlMail = compiler({
        nameUser: name
      });

      send(`${name} <${email}>`, 'Thank You for Creating an Account', htmlMail);

      return res.status(201).json({ ...newUser });
    }
  }
  async show(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
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

  async login(req: Request, res: Response) {
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

    const jwtPass: string | undefined = process.env.JWT_PASS;

    if (!jwtPass) {
      throw new ServerError('JWT_PASS environment variable is not set');
    }

    const token = jwt.sign({ id: user.id }, jwtPass, { expiresIn: '8h' });

    const { password: _, ...userData } = user;

    return res.status(200).json({ user: userData, token });
  }

  async update(req: Request, res: Response) {}

  async destroy(req: RequestWhitEntity, res: Response) {
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
}
