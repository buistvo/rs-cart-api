import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartItem } from './models';
import { Order } from 'src/order/models/order';
import { User } from 'src/users/models/user';

@Module({
  imports: [
    OrderModule,
    TypeOrmModule.forFeature([Cart, CartItem, Order, User]),
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
