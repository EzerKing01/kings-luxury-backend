import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { Room } from '../rooms/room.entity';
import { Booking } from '../bookings/booking.entity';
import { MenuItem } from '../restaurant/menu-item.entity';
import { Order } from '../restaurant/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Booking, MenuItem, Order])],
  controllers: [AdminController],
})
export class AdminModule {}