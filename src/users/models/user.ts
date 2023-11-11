import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('text')
  name: string;

  @Column('text', { nullable: true })
  email?: string;

  @Column('text')
  password?: string;
}
