import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Repository } from 'typeorm';
import { User } from '../models/user';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByName(name: string): Promise<User> {
    return this.usersRepository.findOneBy({ name });
  }

  async createOne({ name, password }: User): Promise<User> {
    const id = v4();
    const newUser = { id: name || id, name, password };

    await this.usersRepository.insert(newUser);

    return newUser;
  }
}
