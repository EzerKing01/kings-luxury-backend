import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity';
import { MenuItem } from './menu-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @ManyToMany(() => MenuItem)
  @JoinTable()
  items: MenuItem[];

  @Column('decimal')
  totalAmount: number;

  @Column()
  orderCode: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // New fields for checkout
  @Column({ nullable: true })
  paymentMethod: string; // 'card', 'paypal', 'cash'

  @Column({ nullable: true })
  deliveryOption: string; // 'room', 'pickup', 'location'

  @Column({ nullable: true })
  roomNumber: string; // if deliveryOption === 'room'

  @Column({ nullable: true })
  address: string; // if deliveryOption === 'location'
}