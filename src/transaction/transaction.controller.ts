import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('api/transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() body: CreateTransactionDto, @Req() request) {
        return await this.transactionService.create(body, request.user.userName);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getTransactions(@Req() request) {
        return await this.transactionService.getTransactions(request.user.userName);
    }
}
