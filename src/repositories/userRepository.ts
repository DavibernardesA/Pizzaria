import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

export const userRepository: Repository<User> & {
  findByName(name: string): Promise<User[]>;
  findByEmail(email: string): Promise<User[]>;
} = AppDataSource.getRepository(User).extend({
  async findByName(name: string) {
    return this.find({ where: { name } });
  },

  async findByEmail(email: string) {
    return this.find({ where: { email } });
  }
});
