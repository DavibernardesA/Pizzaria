import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Order } from '../entities/Order';

export const orderRepository: Repository<Order> & {
  findByObservation(observation: string): Promise<Order[]>;
} = AppDataSource.getRepository(Order).extend({
  async findByObservation(observation: string) {
    return this.find({ where: { observation } });
  }
});
