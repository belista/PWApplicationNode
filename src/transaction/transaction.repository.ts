import { Transaction } from 'src/shared/entities/transaction';
import { User } from 'src/shared/entities/user';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {

  async createTransaction(transactionDto: CreateTransactionDto, user: User, currentBalance) {
    return await this.save({ 
        date: new Date(), 
        amount: transactionDto.amount, 
        balance: currentBalance,  
        user: user,
        userName: transactionDto.userName});
  };

}