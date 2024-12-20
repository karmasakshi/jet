import { User } from './user.interface';

export interface Profile {
  user_id: User['id'];
  username: string;
}
