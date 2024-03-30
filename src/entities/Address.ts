import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './User';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  zipcode: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  house_number: string;

  @Column({ nullable: true })
  complement: string;

  @Column({ nullable: true })
  neighborhood: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @OneToOne(() => User, user => user.address)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
