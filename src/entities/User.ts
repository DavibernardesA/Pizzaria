import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Adress } from './Adress';

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

  @OneToMany(() => Adress, adress => adress)
  adress: Adress[];
}
