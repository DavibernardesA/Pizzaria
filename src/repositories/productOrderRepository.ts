import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Product_order } from '../entities/Product_order';

export const productOrderRepository: Repository<Product_order> & {
  findByProductId(product_id: number): Promise<Product_order[]>;
} = AppDataSource.getRepository(Product_order).extend({
  async findByProductId(product_id: number) {
    return this.find({ where: { product_id } });
  }
});
