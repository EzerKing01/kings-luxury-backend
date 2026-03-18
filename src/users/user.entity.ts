import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Booking } from '../bookings/booking.entity';
import { Order } from '../restaurant/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // will be hashed

  @Column()
  name: string;
  
@Column({ default: 'customer' })
role: string; // 'admin' or 'customer'

  @OneToMany(() => Booking, booking => booking.user)
  bookings: Booking[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
  
}
