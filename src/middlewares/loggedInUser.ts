import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../helpers/api-error';
import chat from '../chat/statusMessage';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { envChecker } from '../utils/envChecker';
import { userRepository } from '../repositories/userRepository';
import { User } from '../entities/User';

export const loggedInUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new UnauthorizedError(chat.error401);
  }

  const token: string = authorization.split(' ')[1];

  const jwtPass: string = envChecker(process.env.JWT_PASS);

  const { id } = jwt.verify(token, jwtPass) as JwtPayload;

  const user: User | null = await userRepository.findOne({ where: { id } });

  if (!user) {
    throw new UnauthorizedError(chat.error401);
  }

  req.user = user;

  next();
};
