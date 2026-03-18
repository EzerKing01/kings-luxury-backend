import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MenuItem } from './menu-item.entity';
import { Order } from './order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem, Order])],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService], // optional, if needed elsewhere
})
export class RestaurantModule {}