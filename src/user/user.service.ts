import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository) private readonly usersRepository: UserRepository, 
        private readonly authService: AuthService) {}

    async register(dto: CreateUserDto) {

        const user = await this.usersRepository.findOne({ where: { userName: dto.userName } });
      
        if(user) {
            throw new BadRequestException({ description: "User with this userName alredy exists." })
        }
      
        let hash = await this.authService.hashPassword(dto.password);
      
        await this.usersRepository.register({ userName: dto.userName, password: hash, email: dto.email, balance: 500 });
      
        return this.authService.createToken(dto.userName);
    }

    async login(dto: LoginUserDto) {
        const user = await this.usersRepository.findOne({ where: { userName: dto.userName } });

        if(!user) {
            throw new NotFoundException({ description: 'User with this nickname does not exist.' });
        }

        if(await this.authService.validateUser(user, dto.password)) {
            return this.authService.createToken(dto.userName);
        } else {
            throw new UnauthorizedException({ description: 'Invalid password.' });
        }
    }

    async getUserInfo(userName: string) {
        const user = await this.usersRepository.findOne({ where: { userName: userName } });

        if(!user) {
            throw new NotFoundException({ description: 'User with this nickname does not exist.' });
        }

        return { id: user.id, userName: user.userName, email: user.email, balance: user.balance };
    }

    async getList(filter: string) {
        try {
            const users = await this.usersRepository.query(`SELECT * FROM pwapplication.user WHERE userName LIKE '%${filter}%'`);
            return users;
        } catch(err) {
            throw new InternalServerErrorException({ description: err.sqlMessage });
        }
    }
}
