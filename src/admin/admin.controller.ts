import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../common/guards/admin.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../rooms/room.entity';
import { Booking } from '../bookings/booking.entity';
import { MenuItem } from '../restaurant/menu-item.entity';
import { Order } from '../restaurant/order.entity';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(MenuItem)
    private menuRepository: Repository<MenuItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  @Get('stats')
  async getStats() {
    const totalRooms = await this.roomRepository.count();
    const availableRooms = await this.roomRepository.count({ where: { isAvailable: true } });
    const totalBookings = await this.bookingRepository.count();
    const pendingBookings = await this.bookingRepository.count({ where: { status: 'pending' } });
    const totalMenuItems = await this.menuRepository.count();
    const totalOrders = await this.orderRepository.count();
    const pendingOrders = await this.orderRepository.count({ where: { status: 'pending' } });
    
    // Calculate revenue from orders
    const revenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .getRawOne();
    const totalRevenue = revenueResult?.total || 0;

    return {
      totalRooms,
      availableRooms,
      totalBookings,
      pendingBookings,
      totalMenuItems,
      totalOrders,
      pendingOrders,
      totalRevenue,
    };
  }
}