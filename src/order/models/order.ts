// import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { Cart, CartItem } from '../../cart/models';

// @Entity()
// export class Order {
//   @PrimaryGeneratedColumn('uuid')
//   id?: string;

//   @Column('uuid')
//   userId: string;

//   @Column('uuid')
//   cartId: string;

//   @ManyToOne(() => Cart)
//   @JoinColumn({ name: 'cart_id' })
//   cart: Cart;

//   @Column('jsonb')
//   payment: {
//       type: string,
//       address?: any,
//       creditCard?: any,
//   };

//   @Column('jsonb')
//   delivery: {
//       type: string,
//       address: any,
//   };
//   @Column('text')
//   comments: string;

//   @Column({ type: 'enum', enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'], default: 'PENDING' })
//   status: string;

//   @Column('decimal', { precision: 10, scale: 2 })
//   total: number;
// }
import { CartItem } from '../../cart/models';

export type Order = {
  id?: string,
  userId: string;
  cartId: string;
  items: CartItem[]
  payment: {
    type: string,
    address?: any,
    creditCard?: any,
  },
  delivery: {
    type: string,
    address: any,
  },
  comments: string,
  status: string;
  total: number;
}
