import { Request } from 'express';

export interface RequestWhitEntity extends Request {
  user?: any;
}
