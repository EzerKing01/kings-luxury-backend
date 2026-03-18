import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Booking } from '../bookings/booking.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal')
  pricePerNight: number;

  @Column()
  capacity: number;

  @Column({ nullable: true })
  category: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column('simple-json', { nullable: true })
  images: string[]; // array of image filenames

  @OneToMany(() => Booking, booking => booking.room)
  bookings: Booking[];
}