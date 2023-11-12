import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column('date')
  created_at: Date;

  @Column('date')
  updated_at: Date;

  @Column('enum', { enum: ['OPEN', 'ORDERED'] })
  status: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  cartItems: CartItem[];
}

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('uuid', { name: 'cart_id' })
  cartId: string;

  @Column('uuid')
  product_id: string;

  @Column('int')
  count: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  product: Product;
}
