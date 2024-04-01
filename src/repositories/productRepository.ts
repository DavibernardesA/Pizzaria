import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';

export const ProductRepository: Repository<Product> & {
  findByName(name: string): Promise<Product[]>;
} = AppDataSource.getRepository(Product).extend({
  findByName(name: string): Promise<Product[]> {
    return this.find({ where: { name } });
  }
});
