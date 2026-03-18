import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  findAll(): Promise<Room[]> {
    return this.roomsRepository.find();
  }

  async findOne(id: number): Promise<Room | null> {
    return this.roomsRepository.findOne({ where: { id } });
  }

  create(roomData: Partial<Room>): Promise<Room> {
    const room = this.roomsRepository.create(roomData);
    return this.roomsRepository.save(room);
  }

  async update(id: number, roomData: Partial<Room>): Promise<Room | null> {
    await this.roomsRepository.update(id, roomData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.roomsRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}