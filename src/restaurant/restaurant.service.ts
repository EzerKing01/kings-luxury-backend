import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './menu-item.entity';
import { Order } from './order.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(MenuItem)
    private menuRepository: Repository<MenuItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  // ---------- Menu Item Methods ----------
  async findAll(): Promise<MenuItem[]> {
    return this.menuRepository.find();
  }

  async findOne(id: number): Promise<MenuItem> {
    const item = await this.menuRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    return item;
  }

  async create(itemData: Partial<MenuItem>): Promise<MenuItem> {
    const item = this.menuRepository.create(itemData);
    return this.menuRepository.save(item);
  }

  async update(id: number, itemData: Partial<MenuItem>): Promise<MenuItem> {
    await this.menuRepository.update(id, itemData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.menuRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  // ---------- Order Methods ----------
  async findOrdersByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    // Generate a unique order code
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    orderData.orderCode = `ORD-${timestamp}-${randomStr}`;

    // Ensure items are set (if not already)
    if (!orderData.items) {
      orderData.items = [];
    }

    const order = this.orderRepository.create(orderData);
    return this.orderRepository.save(order);
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    await this.orderRepository.update(id, { status });
    const updatedOrder = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return updatedOrder;
  }
}