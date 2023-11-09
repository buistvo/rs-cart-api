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
    return this.cartRepository.findOne({where: {user_id}, relations: ['cartItems']});
  }

  async createByUserId(user_id: string) {
    console.log('create')
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
    const saved = await this.cartRepository.insert(cart);
    console.log(saved);

    return cart;
  }

  async findOrCreateByUserId(userId = '5d27e3e9-5d22-4a57-8d41-42d7299f62ce'): Promise<Cart> {
    const userCart = await this.findByUserId(userId);
    console.log('findOrCreateByUserId', userCart)

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
