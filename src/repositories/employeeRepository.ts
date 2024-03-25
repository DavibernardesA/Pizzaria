import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Employee } from '../entities/Employee';

export const employeeRepository: Repository<Employee> & {
  findByName(name: string): Promise<Employee[]>;
  findByEmail(email: string): Promise<Employee[]>;
} = AppDataSource.getRepository(Employee).extend({
  async findByName(name: string) {
    return this.find({ where: { name } });
  },

  async findByEmail(email: string) {
    return this.find({ where: { email } });
  }
});
