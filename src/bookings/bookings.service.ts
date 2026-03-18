import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({ relations: ['user', 'room'] });
  }

  async findOne(id: number): Promise<Booking | null> {
    return this.bookingsRepository.findOne({
      where: { id },
      relations: ['user', 'room'],
    });
  }

  create(bookingData: Partial<Booking>): Promise<Booking> {
    const booking = this.bookingsRepository.create(bookingData);
    return this.bookingsRepository.save(booking);
  }

  async update(id: number, bookingData: Partial<Booking>): Promise<Booking | null> {
    await this.bookingsRepository.update(id, bookingData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.bookingsRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
async findByUser(userId: number): Promise<Booking[]> {
  return this.bookingsRepository.find({
    where: { user: { id: userId } },
    relations: ['room'],
    order: { checkInDate: 'DESC' }
  });
}
  
}