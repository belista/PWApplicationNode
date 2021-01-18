import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService {

    constructor(
        @InjectRepository(TransactionRepository) private readonly transactionsRepository: TransactionRepository,
        @InjectRepository(UserRepository) private readonly usersRepository: UserRepository
    ) {}

    async create(dto: CreateTransactionDto, userName: string) {

        const recipient = await this.usersRepository.findOne({ where: { userName: dto.userName } });

        if(!recipient) {
            throw new NotFoundException({ description: "User with this recipient nickname does not exist." });
        }

        const user = await this.usersRepository.findOne({ where: { userName: userName } });

        if(!user) {
            throw new NotFoundException({ description: 'User with this nickname does not exist.' });
        }

        if(user.balance < dto.amount) {
            throw new BadRequestException({ description: "Not enough funds." });
        }

        try {
            await this.transactionsRepository.createTransaction(dto, user, user.balance - dto.amount);

            await this.usersRepository.save({ id: user.id, balance: user.balance - dto.amount });

            await this.usersRepository.save({ id: recipient.id, balance: recipient.balance + dto.amount });

            return true;
        } catch(err) {
            throw new InternalServerErrorException({ description: err.sqlMessage });
        }
    }

    async getTransactions(userName: string) {
        const user = await this.usersRepository.findOne({ where: { userName: userName }, relations: ["transactions"] });

        if(!user) {
            throw new NotFoundException({ description: 'User with this nickname does not exist.' });
        }

        return user.transactions;
    }
}
