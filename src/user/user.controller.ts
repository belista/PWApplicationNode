import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { FilteredUsersDto } from './dto/filtered-users.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() body: CreateUserDto) {
        return await this.userService.register(body);
    }

    @HttpCode(200)
    @Post('login')
    async login(@Body() body: LoginUserDto) {
        return await this.userService.login(body);
    }

    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @Get('user-info')
    async userInfo(@Req() request) {
        return await this.userService.getUserInfo(request.user.userName);
    }

    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @Post('list')
    async usersList(@Body() body: FilteredUsersDto) {
        return await this.userService.getList(body.filter);
    }
}
