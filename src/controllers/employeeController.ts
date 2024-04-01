import { Request, Response } from 'express';
import { BadRequestError, InvalidFormatError, NotFoundError, UnauthorizedError } from '../helpers/api-error';
import chat from '../chat/statusMessage';
import { s3Client } from '../services/aws';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import bcrypt from 'bcrypt';
import { employeeRepository } from '../repositories/employeeRepository';
import { Employee } from '../entities/Employee';
import jwt from 'jsonwebtoken';
import deleteImage from '../services/deleteImage';
import { userRepository } from '../repositories/userRepository';
import { envChecker } from '../utils/envChecker';
import { RequestWhitEntity } from '../interfaces/RequestWhitEntity';
import { LoginEmployee } from '../DTO/Login';

export class EmployeeController {
  async index(_: Request, res: Response): Promise<Response<Employee[]>> {
    const employees: Employee[] = await employeeRepository.find();

    if (employees.length < 1) {
      throw new NotFoundError(chat.error404);
    }

    return res.status(200).json(employees);
  }

  async show(req: Request, res: Response): Promise<Response<Employee>> {
    const { id } = req.params;

    const employeeId: number = parseInt(id);

    if (!id || isNaN(employeeId)) {
      throw new BadRequestError(chat.error400);
    }

    const employee: Employee | null = await employeeRepository.findOne({ where: { id: employeeId } });

    if (!employee) {
      throw new NotFoundError(chat.error404);
    }
    return res.status(200).json(employee);
  }

  async store(req: Request, res: Response): Promise<Response<Employee>> {
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
      const Key = `profiles/employees${encodeURIComponent(name)}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: envChecker(process.env.KEY_NAME_BUCKET),
          Key,
          Body: avatar.buffer,
          ContentType: avatar.mimetype
        })
      );

      const s3URL: string = `http://${envChecker(process.env.ENDPOINT_BUCKET)}/${Key}`;

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newEmployee: Omit<Employee, 'id'> = {
        name,
        email,
        password: encryptedPassword,
        avatar: s3URL
      };
      const savedEmployee: Employee = employeeRepository.create(newEmployee);
      await employeeRepository.save(savedEmployee);

      return res.status(201).json();
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10);

      const newEmployee: Omit<Employee, 'id'> = {
        name,
        email,
        password: encryptedPassword,
        avatar: ''
      };
      const savedEmployee: Employee = employeeRepository.create(newEmployee);
      await employeeRepository.save(savedEmployee);

      return res.status(201).json();
    }
  }

  async login(req: Request, res: Response): Promise<Response<LoginEmployee>> {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new InvalidFormatError(chat.error400);
    }

    const employees: Employee[] = await employeeRepository.findByEmail(email);

    if (employees.length < 1) {
      throw new NotFoundError(chat.error404);
    }

    const employee: Employee = employees[0];

    const correctPassword: boolean = await bcrypt.compare(password, employee.password);

    if (!correctPassword) {
      throw new InvalidFormatError(chat.error400);
    }

    const jwtPass: string | undefined = envChecker(process.env.JWT_PASS);

    const token = jwt.sign({ id: employee.id }, jwtPass, { expiresIn: '8h' });

    const { password: _, ...employeeData } = employee;

    return res.status(200).json({ employee: employeeData, token });
  }

  async update(req: Request, res: Response): Promise<Response<void>> {
    const { name, email, password, avatar } = req.body;
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new InvalidFormatError(chat.error400);
    }

    const employeeId: number = parseInt(id);

    if (!id || isNaN(employeeId)) {
      throw new BadRequestError(chat.error400);
    }

    const employee: Employee | null = await employeeRepository.findOne({ where: { id: employeeId } });

    if (!employee) {
      throw new NotFoundError(chat.error404);
    }

    const employeeData: Partial<Employee> = {
      name: name || employee.name,
      email: email || employee.email,
      password: password || employee.password,
      avatar: avatar || employee.avatar
    };

    Object.assign(employee, employeeData);

    if (employeeId !== employee.id) {
      throw new UnauthorizedError(chat.error401);
    }
    await employeeRepository.save(employee);

    return res.status(200).json(employee);
  }

  async destroy(req: RequestWhitEntity, res: Response): Promise<Response<void>> {
    const { id } = req.params;

    const userId: number = parseInt(id);

    if (!id || isNaN(userId)) {
      throw new BadRequestError(chat.error400);
    }

    const employee: Employee | null = await employeeRepository.findOne({ where: { id: userId } });

    if (!employee) {
      throw new NotFoundError(chat.error404);
    }

    const avatar: string | undefined = employee.avatar;

    if (avatar) {
      await deleteImage(avatar, 'profiles/employees');
    }

    if (employee.id === req.user.id) {
      await employeeRepository.delete(employee);
    } else {
      throw new UnauthorizedError(chat.error401);
    }

    return res.status(203).json();
  }
}
