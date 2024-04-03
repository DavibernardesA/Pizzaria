import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './Address';
import { Order } from './Order';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToOne(() => Address, address => address.user, { nullable: true })
  address?: Address;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}
