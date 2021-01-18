import { User } from 'src/shared/entities/user';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async register(userDto: CreateUserDto) {
    return await this.save(userDto);
  };

}