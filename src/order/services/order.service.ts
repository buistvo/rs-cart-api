import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { Order } from '../models/order';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['cart'],
    });
    return order;
  }

  async create(data: any) {
    const id = v4();
    const order: Order = {
      ...data,
      id,
      status: 'IN_PROGRESS',
    };

    await this.orderRepository.save(this.orderRepository.create(order));
    return order;
  }

  async update(orderId: string, data) {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    await this.orderRepository.save({ ...order, data });
  }
}
