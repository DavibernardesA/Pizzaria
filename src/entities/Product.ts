import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './Category';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column()
  stock: number;

  @Column()
  category_id: number;

  @OneToOne(() => Category, category => category, { nullable: true })
  category?: Category;
}
