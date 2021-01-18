import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    date: Date;

    @Column({ nullable: false })
    userName: string;

    @Column({ nullable: false })
    amount: number;

    @Column({ nullable: false })
    balance: number;

    @ManyToOne(type => User, user => user.transactions)
    user: User;
}