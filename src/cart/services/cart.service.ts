import { Injectable } from '@nestjs/common';

import * as uuid from 'uuid';

import { Cart, Product } from '../models';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}
  private productServiceUrl =
    'https://u0sl31di08.execute-api.eu-north-1.amazonaws.com/dev/product';

  async findByUserId(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['cartItems'],
    });
    if (cart && cart.cartItems?.length) {
      for (let item of cart.cartItems) {
        const response = await fetch(
          `${this.productServiceUrl}/${item.product_id}`,
        );
        if (response.ok) {
          item.product = await response.json();
        }
      }
    }

    return cart;
  }

  async createByUserId(userId: string) {
    const id = uuid.v4();
    const userCart: Cart = {
      id,
      userId,
      created_at: new Date(),
      updated_at: new Date(),
      status: 'OPEN',
      cartItems: [],
    };
    const cart = this.cartRepository.create(userCart);
    const saved = await this.cartRepository.insert(cart);

    return cart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);
    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, cart: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);
    const updatedCart: Cart = {
      id,
      ...rest,
      ...cart,
      cartItems: [...cart.cartItems],
    };

    const saved = await this.cartRepository.save(updatedCart);

    return saved;
  }

  removeByUserId(userId: string): void {
    this.cartRepository.delete({ userId });
  }
}
