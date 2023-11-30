import { Request } from 'express';
import { User } from 'src/users/models/user';

export interface AppRequest extends Request {
  user?: User;
  statusCode: number;
}
