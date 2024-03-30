import { Employee } from '../entities/Employee';
import { User } from '../entities/User';

export class LoginEmployee {
  Entity: Employee;
  token: string;
}

export class LoginUser {
  Entity: User;
  token: string;
}
