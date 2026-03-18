import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() req): Promise<Booking[]> {
    // If admin, return all bookings; if regular user, return only theirs
    // For simplicity, you might implement role-based logic later
    return this.bookingsService.findAll();
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async getUserBookings(@Req() req): Promise<Booking[]> {
    return this.bookingsService.findByUser(req.user.userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string): Promise<Booking> {
    const booking = await this.bookingsService.findOne(+id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() bookingData: Partial<Booking>, @Req() req): Promise<Booking> {
    // Associate booking with the logged-in user
    bookingData.user = { id: req.user.userId } as any;
    return this.bookingsService.create(bookingData);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() bookingData: Partial<Booking>): Promise<Booking> {
    const updated = await this.bookingsService.update(+id, bookingData);
    if (!updated) {
      throw new NotFoundException('Booking not found');
    }
    return updated;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    const deleted = await this.bookingsService.remove(+id);
    if (!deleted) {
      throw new NotFoundException('Booking not found');
    }
    return { message: 'Booking deleted successfully' };
  }
}