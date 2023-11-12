import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';

// import { BasicAuthGuard, JwtAuthGuard } from '../auth';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import { OrderService } from '../order/services/order.service';
import { Order } from 'src/order/models/order';
import { BasicAuthGuard } from 'src/auth';
import { DataSource } from 'typeorm';
import { Cart, CartItem } from './models';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private dataSource: DataSource,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    const cart = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart, total: calculateCartTotal(cart) },
    };
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body: CartItem[]) {
    const cart = await this.cartService.findByUserId(getUserIdFromRequest(req));
    cart.cartItems = cart.cartItems.map((item) => {
      const itemToUpdate = body.find(
        (dtoItem) => dtoItem.product_id === item.product_id,
      );
      return itemToUpdate
        ? {
            ...item,
            ...itemToUpdate,
          }
        : item;
    });

    const updatedCart = await this.cartService.updateByUserId(
      getUserIdFromRequest(req),
      cart,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart: updatedCart,
        total: calculateCartTotal(cart),
      },
    };
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Delete()
  clearUserCart(@Req() req: AppRequest) {
    this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body: Partial<Order>) {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);
    if (!(cart && cart.cartItems.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode;

      return {
        statusCode,
        message: 'Cart is empty',
      };
    }
    const total = calculateCartTotal(cart);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const order = await this.orderService.create(
        {
          ...body, // TODO: validate and pick only necessary data
          userId,
          cart,
          total,
        },
        queryRunner.manager,
      );
      await this.cartService.updateByUserId(
        userId,
        {
          ...cart,
          status: 'ORDERED',
        },
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { order },
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: e.message,
      };
    } finally {
      await queryRunner.release();
    }
  }
}
