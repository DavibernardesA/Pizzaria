import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Product } from './Product';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @OneToOne(() => Product, product => product.category)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
