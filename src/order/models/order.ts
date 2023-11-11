import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart, CartItem } from '../../cart/models';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => Cart)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column('jsonb')
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };

  @Column('jsonb')
  delivery: {
    type: string;
    address: any;
  };
  @Column('text', { nullable: true })
  comments: string;

  @Column({
    type: 'enum',
    enum: ['IN_PROGRESS', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
    default: 'IN_PROGRESS',
  })
  status: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;
}
