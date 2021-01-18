import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/shared/entities/transaction';
import { TransactionRepository } from './transaction.repository';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TransactionRepository, UserRepository])],
  providers: [TransactionService],
  controllers: [TransactionController]
})
export class TransactionModule {

}
