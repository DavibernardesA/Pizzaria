import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './Order';

@Entity('product_order')
export class Product_order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.products)
  order: Order;

  @Column()
  product_id: number;

  @Column()
  quantity: number;

  @Column()
  value: number;
}
