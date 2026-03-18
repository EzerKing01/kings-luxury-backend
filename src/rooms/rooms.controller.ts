import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  NotFoundException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../common/guards/admin.guard';
import { multerConfig } from '../common/multer.config';
import { RoomsService } from './rooms.service';
import { Room } from './room.entity';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async findAll(): Promise<Room[]> {
    return this.roomsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Room> {
    const room = await this.roomsService.findOne(+id);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseInterceptors(FilesInterceptor('images', 5, multerConfig))
  async create(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Room> {
    const roomData = {
      name: body.name,
      description: body.description,
      pricePerNight: parseFloat(body.pricePerNight),
      capacity: parseInt(body.capacity, 10),
      category: body.category,
      isAvailable: body.isAvailable === 'true',
      images: files ? files.map(f => f.filename) : [],
    };
    return this.roomsService.create(roomData);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseInterceptors(FilesInterceptor('images', 5, multerConfig))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Room> {
    const roomData: any = {
      name: body.name,
      description: body.description,
      pricePerNight: parseFloat(body.pricePerNight),
      capacity: parseInt(body.capacity, 10),
      category: body.category,
      isAvailable: body.isAvailable === 'true',
    };
    if (files && files.length > 0) {
      roomData.images = files.map(f => f.filename);
    }
    const updated = await this.roomsService.update(+id, roomData);
    if (!updated) {
      throw new NotFoundException('Room not found');
    }
    return updated;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    const deleted = await this.roomsService.remove(+id);
    if (!deleted) {
      throw new NotFoundException('Room not found');
    }
    return { message: 'Room deleted successfully' };
  }
}