import { Injectable } from '@nestjs/common';

import * as uuid from 'uuid';

import { Cart } from '../models';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>
  ) { }

  private userCarts: Record<string, Cart> = {};

  async findByUserId(user_id: string): Promise<Cart> {
    return this.cartRepository.findOneBy({user_id});
  }

  async createByUserId(user_id: string) {
    const id = uuid.v4()
    const userCart: Cart = {
      id,
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
      status: 'OPEN',
      cartItems: [],
    };
    const cart = this.cartRepository.create(userCart);
    const [saved] = await this.cartRepository.save([cart])
    return saved;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, cart: Cart):  Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart: Cart = {
      id,
      ...rest,
      cartItems: [ ...cart.cartItems ],
    }

    const [saved] = await this.cartRepository.save([cart])

    return saved;
  }

  removeByUserId(userId): void {
    this.userCarts[ userId ] = null;
  }

}
