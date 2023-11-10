import { Module } from '@nestjs/common';
import { OrderService } from './services';

@Module({
//     imports: [
//     TypeOrmModule.forFeature([Cart, CartItem]),
//  ],
  providers: [ OrderService ],
  exports: [ OrderService ]
})
export class OrderModule {}
