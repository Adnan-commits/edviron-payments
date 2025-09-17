// src/transactions/dto/create-transaction.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
