import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/shared/entities/user';

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService) {}

    createToken(userName: string) {
        const payload = { userName };
        return this.jwtService.sign(payload);
    }

    async validateUser(user: User, pass: string): Promise<any> {

        const isPasswordMatching = await bcrypt.compare(
            pass,
            user.password
          );

        if (!isPasswordMatching) {
            return false;
        }

        return true;
    }

    async hashPassword(password: string) {
        try {
            return await bcrypt.hash(password, 10);
        } catch(err) {
            return '';
        }
    }
}
