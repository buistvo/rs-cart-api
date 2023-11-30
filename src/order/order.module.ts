import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { Order } from './models/order';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartItem } from 'src/cart';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Order])],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
