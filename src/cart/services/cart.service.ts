import { Injectable } from '@nestjs/common';

import * as uuid from 'uuid';

import { Cart, Product } from '../models';
import { EntityManager, Repository } from 'typeorm';
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
    return this.enrichWithProductDetails(cart);
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

  async updateByUserId(
    userId: string,
    cart: Partial<Cart>,
    entityManager?: EntityManager,
  ): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);
    const updatedCart = this.cartRepository.create({
      id,
      ...rest,
      ...cart,
      cartItems: [...cart.cartItems],
    });
    const saved = entityManager
      ? await entityManager.save<Cart>(updatedCart)
      : await this.cartRepository.save(updatedCart);
    return this.enrichWithProductDetails(saved);
  }
  removeByUserId(userId: string): void {
    this.cartRepository.delete({ userId });
  }

  private async enrichWithProductDetails(cart: Cart): Promise<Cart> {
    if (!cart || !cart.cartItems?.length) return cart;
    for (let item of cart.cartItems) {
      if (item.product) continue;
      const response = await fetch(
        `${this.productServiceUrl}/${item.product_id}`,
      );
      if (response.ok) {
        item.product = (await response.json()) || { price: 0 };
      }
    }
    return cart;
  }
}
