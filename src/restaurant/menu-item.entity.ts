import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  category: string;

  @Column({ default: true })
  available: boolean;

  @Column('simple-json', { nullable: true })
  images: string[];

  @Column('text', { nullable: true }) // new field
  ingredients: string; // e.g., "tomato, onion, garlic"
}