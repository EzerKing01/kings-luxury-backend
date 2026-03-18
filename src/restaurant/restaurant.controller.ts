import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  NotFoundException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../common/guards/admin.guard';
import { multerConfig } from '../common/multer.config';
import { RestaurantService } from './restaurant.service';
import { MenuItem } from './menu-item.entity';
import { Order } from './order.entity'; // <-- ADD THIS IMPORT

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  // Public endpoints
  @Get('menu')
  async getMenu(): Promise<MenuItem[]> {
    return this.restaurantService.findAll();
  }

  @Get('menu/:id')
  async getMenuItem(@Param('id') id: string): Promise<MenuItem> {
    const item = await this.restaurantService.findOne(+id);
    if (!item) {
      throw new NotFoundException('Menu item not found');
    }
    return item;
  }

  // User orders
  @Get('orders/user')
  @UseGuards(AuthGuard('jwt'))
  async getUserOrders(@Req() req) {
    return this.restaurantService.findOrdersByUser(req.user.userId);
  }

  @Post('orders')
  @UseGuards(AuthGuard('jwt'))
  async createOrder(@Body() orderData: any, @Req() req): Promise<Order> {
    // Attach user ID from token
    orderData.user = { id: req.user.userId };
    return this.restaurantService.createOrder(orderData);
  }

  // Admin endpoints for menu management with file upload
  @Post('menu')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseInterceptors(FilesInterceptor('images', 5, multerConfig))
  async createMenuItem(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<MenuItem> {
    const itemData = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      category: body.category,
      available: body.available === 'true',
      ingredients: body.ingredients,
      images: files ? files.map(f => f.filename) : [],
    };
    return this.restaurantService.create(itemData);
  }

  @Put('menu/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseInterceptors(FilesInterceptor('images', 5, multerConfig))
  async updateMenuItem(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<MenuItem> {
    const itemData: any = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      category: body.category,
      available: body.available === 'true',
      ingredients: body.ingredients,
    };
    if (files && files.length > 0) {
      itemData.images = files.map(f => f.filename);
    }
    const updated = await this.restaurantService.update(+id, itemData);
    if (!updated) {
      throw new NotFoundException('Menu item not found');
    }
    return updated;
  }

  @Delete('menu/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async deleteMenuItem(@Param('id') id: string): Promise<{ message: string }> {
    const deleted = await this.restaurantService.remove(+id);
    if (!deleted) {
      throw new NotFoundException('Menu item not found');
    }
    return { message: 'Menu item deleted successfully' };
  }
}