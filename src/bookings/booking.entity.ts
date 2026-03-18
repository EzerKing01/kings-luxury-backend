import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Room } from '../rooms/room.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bookings)
  user: User;

  @ManyToOne(() => Room, room => room.bookings)
  room: Room;

  @Column()
  checkInDate: Date;

  @Column()
  checkOutDate: Date;

  @Column({ default: 'pending' }) // pending, confirmed, cancelled
  status: string;

  @Column('decimal')
  totalPrice: number;
}